import re
from glob import glob
from os import listdir
from os import path, remove, rename
from shutil import rmtree
from threading import Thread

from PIL import Image
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.core.mail import EmailMessage
from django.http import HttpResponse
from django.utils.html import format_html
from imagekit import ImageSpec
from imagekit.cachefiles import ImageCacheFile
from imagekit.processors import ResizeToFit  # , ResizeToFill
from uuslug import slugify


def is_file_exist(obj):
    return obj and path.isfile(obj.path)


def is_image_file(obj):
    filename, ext = path.splitext(obj.file.name)
    return ext.lower() == '.jpg' or ext.lower() == '.jpeg' or ext.lower() == '.png' or ext.lower() == '.gif'


# delete obj related media files, and their cached thumbnails
def remove_media_folder(relative_folder):
    absolute_path = path.join(settings.BASE_DIR, settings.MEDIA_ROOT, settings.FILES_UPLOAD_FOLDER, relative_folder)
    rmtree(absolute_path, ignore_errors=True)


# delete obj related media files and their cached thumbnails
def remove_media(obj, **kwargs):
    if obj and obj.path:
        delete_folder = kwargs.get('delete_folder', None)
        if delete_folder:
            project_folder, filename = path.split(obj.path)
        else:
            filename, ext = path.splitext(obj.path)
            if ext.lower() == '.jpg' or ext.lower() == '.jpeg' or ext.lower() == '.png' or ext.lower() == '.gif':
                cache_folder = filename.replace('/media/', '/media/CACHE/images/')
                rmtree(cache_folder, ignore_errors=True)
                # select all thumbs for original file
                files = glob(filename + '_[0-9][0-9]*w' + ext)
                # add to files array if original file exists on disk
                if path.isfile(obj.path) or path.islink(obj.path):
                    files.append(obj.path)
                for f in files:
                    remove(f)
            else:
                remove(obj.path)


def generate_media(obj, *sizes, resize_source=True):
    if obj and is_image_file(obj):
        file = obj.path
        old_file = file + '.old'
        try:
            if resize_source:
                source = open(file, 'rb')
                base_image = Portfolio(source=source)
                result = base_image.generate()
                rename(file, old_file)
                dest = open(file, 'wb')
                dest.write(result.read())
                dest.close()
                remove(old_file)

            if sizes:
                generate_thumbs(obj, *sizes)

        except IOError:
            if path.isfile(old_file):
                rename(old_file, file)
            return HttpResponse('Ошибка открытия файла %s!' % file)


class MediaFileStorage(FileSystemStorage):
    def __init__(self, **kwargs):
        self.output_name = kwargs.get('output', None)
        super().__init__()

    def get_available_name(self, name, max_length=None):
        upload_folder, filename = path.split(name)
        filename, extension = path.splitext(filename)
        ext = extension

        if upload_folder:
            upload_folder += '/'

        if self.output_name:
            filename, ext = path.splitext(self.output_name)
            if not ext:
                ext = extension

        name = upload_folder + slugify(filename)
        filename = name + ext

        # delete a file if exists
        index = 0
        while self.exists(filename):
            index += 1
            filename = f'{name}-{index:02}{ext}'
            if index == 20:
                break
        # remove(self.path(name))

        return filename

    def save(self, name, content, max_length=None):
        return super().save(name, content, max_length)


class AdminThumbnail(ImageSpec):
    w = settings.ADMIN_THUMBNAIL_SIZE[0]
    h = settings.ADMIN_THUMBNAIL_SIZE[1]

    processors = [ResizeToFit(w, h)]
    format = 'JPEG'
    options = {'quality': settings.ADMIN_THUMBNAIL_QUALITY}


class Portfolio(ImageSpec):
    w = settings.PORTFOLIO_IMAGE_SIZE[0]
    h = settings.PORTFOLIO_IMAGE_SIZE[1]

    processors = [ResizeToFit(w, h)]
    autoconvert = True
    format = 'JPEG'
    options = {'quality': settings.PORTFOLIO_IMAGE_QUALITY}


def get_admin_thumb(obj):
    if obj and is_file_exist(obj) and is_image_file(obj):
        thumb = generate_admin_thumb(obj)
        if thumb.url:
            return format_html('<img src="{0}" width="50"/>', thumb.url)
    return format_html('<img src="/media/no-image.png" width="50"/>')


def generate_admin_thumb(obj):
    thumbnail = ImageCacheFile(AdminThumbnail(obj))
    thumbnail.generate()
    return thumbnail


def generate_thumbs(obj, sizes):
    if obj and is_file_exist(obj) and is_image_file(obj):
        file = obj.path
        filename, ext = path.splitext(file)
        with Image.open(file) as image:
            im_w, im_h = image.size
            aspect_ratio = im_w / float(im_h)

            for size in sizes:
                im = image.copy()
                thumb_w = size
                thumb_h = int(thumb_w / aspect_ratio)
                im.thumbnail((thumb_w, thumb_h))
                thumb_filename = '{0}_{1}w{2}'.format(filename, size, ext)
                im.save(thumb_filename)


def media_upload_to(instance, filename):
    # print(instance._meta.model_name)
    if instance._meta.model_name == 'slider':
        related_folder = instance.slider._meta.db_table
        folder = slugify(instance.slider.title)

    elif instance._meta.model_name == 'media':
        related_folder = instance.portfolio._meta.db_table
        folder = slugify(instance.portfolio.title)

    else:
        related_folder = instance._meta.db_table
        folder = slugify(instance.title)

    # latest_id = 1 if not related_model.objects.all() else related_model.objects.latest().id
    return '{0}{1}/{2}/{3}'.format(settings.FILES_UPLOAD_FOLDER, related_folder, folder, filename)


def get_admin_site_url(request):
    protocol = 'https' if request.is_secure() else 'http'
    admin_url = "{0}://{1}".format(protocol, request.get_host())
    return admin_url


def get_site_url(request):
    name = ''
    scheme = 'https' if request.is_secure() else 'http'
    if request.META['HTTP_HOST']:
        url = '%s://%s' % (scheme, request.META['HTTP_HOST'])
    else:
        url = settings.ALLOWED_HOSTS[0] if len(settings.ALLOWED_HOSTS) > 0 else ""

    if url:
        name = re.sub(r'^https?:\/\/|\/(www\.)?$', '', url, flags=re.MULTILINE)
        name = name.strip().strip('/')

    return {'url': url, 'name': name}


def add_domain_to_url(request, value, pattern, start=False):
    if request:
        scheme = 'https' if request.is_secure() else 'http'
        site_domain = '%s://%s' % (scheme, request.get_host())
        search_pattern = pattern.replace('<URL>', '')
        replace_with = pattern.replace('<URL>', site_domain)
        to_replace = value.startswith(search_pattern) if start else True
        if to_replace:
            return value.replace(search_pattern, replace_with)

    return value


def build_srcset(self, obj):
    file_url, _ = path.split(obj.url)
    upload_folder, filename = path.split(obj.path)
    filename, _ = path.splitext(filename)
    files = sorted(listdir(upload_folder), key=lambda s: (len(s), s))
    request = self.context.get('request')
    pattern = '<URL>/media/'
    srcset = []
    for file in files:
        if file.startswith(filename + "_"):
            srcset.append(add_domain_to_url(request, path.join(file_url, file), pattern))
    return srcset


def send_email(subject, template, email_sender=settings.EMAIL_HOST_USER, email_recipients=settings.EMAIL_RECIPIENTS):
    """ Sending email """
    email = EmailMessage(
        subject,
        template,
        email_sender,
        email_recipients,
        reply_to=[settings.EMAIL_RECIPIENTS[0]],
    )

    email.content_subtype = "html"
    email.html_message = True
    email.fail_silently = False

    try:
        email.send()
    except Exception as e:
        print('Mail sending error: %s' % type(e))
        return False

    return True


class AsyncEmail(Thread):
    """ Async email sending class """

    def __init__(self, subject, template, email_sender, email_recipients):
        self.subject = subject
        self.html_content = template
        self.email_sender = email_sender
        self.email_recipients = email_recipients
        Thread.__init__(self)

    def run(self):
        return send_email(self.subject, self.html_content, self.email_sender, self.email_recipients)


def send_email_async(
        subject,
        template, email_sender=settings.EMAIL_HOST_USER,
        email_recipients=settings.EMAIL_RECIPIENTS
):
    """ Sending email to recipients asynchronously """
    AsyncEmail(subject, template, email_sender, email_recipients).start()


def is_mobile(request):
    """ Return True if the request comes from a mobile device """
    import re

    mobile_agent_re = re.compile(r".*(iphone|mobile|androidtouch)", re.IGNORECASE)

    if mobile_agent_re.match(request.META['HTTP_USER_AGENT']):
        return True
    else:
        return False
