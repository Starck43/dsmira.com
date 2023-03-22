import { arrayToParams, cleanDoubleSlashes, getSiteLocation } from "./utils"
import { Fetch } from "./Fetch"

/*
 * getPages([page]) - get page content grouped by header, body and footer blocks to update whole page
 * parameter:
 *  - <page name> - fetching self page section content or home page all sections ('homepage' - slug for home page)
 * return:
 *  - with empty parameter : <objects array of self page>
 *  - with parameter : <object { nav{}, meta{}, header{}, body{}, footer{}, page_route }>
 * */
export async function getPages(page = "") {
    let url = cleanDoubleSlashes(`${process.env.API_SERVER}/${process.env.API_ENDPOINTS.pages}/${page}`)
    const res = await fetch(url)
    return await res.json()
}

/*
 * getPageDetail(id, page) - get page detail content grouped by header, body and footer blocks to update whole page
 * parameter:
 *  - <id> - fetching post content by id
 *  - <page name> - fetching self page section content
 * return:
 *  <object { nav{}, meta{}, header{}, body{}, footer{}, page_route }>
 * */
export async function getPageDetail(id, page) {
    let url = cleanDoubleSlashes(`${process.env.API_SERVER}/${process.env.API_ENDPOINTS.pages}/${page}/${id}`)
    const res = await fetch(url)
    return await res.json()
}

/*
 * getSection(slug, [page_type]) - get posts for selected section to update only components on page
 * parameter:
 *  - <slug> - section name
 *  - <page type> - empty by default or ('index_page', 'self_page') - set strict type of fetching page
 * return: <array of objects { id, content{}, post_type, section, page, area, url }>
 * */
export async function getSection(slug, param = "") {
    let url = cleanDoubleSlashes(
        `${process.env.API_SERVER}/${process.env.API_ENDPOINTS.sections}/${slug}/?page_type=${param}`,
    )
    const res = await fetch(url)
    return await res.json()
}

/*
 * getSectionDetail(id, section) - get detail post content by id with extra data for selected section
 * parameter:
 *  1. <post id> - fetching post by id
 *  2. <section name> - fetching post for selected section
 * return: <object> with {id, content{}, post_type, section, url, page, area, meta}
 * */
export async function getSectionDetail(id, section) {
    let url = cleanDoubleSlashes(`${process.env.API_SERVER}/${process.env.API_ENDPOINTS.sections}/${section}/${id}`)
    const res = await fetch(url)
    return await res.json()
}

/*
 * getPost(id) - get post content by id
 * parameter:
 *  - <post id> - fetching post by id
 * return: <object> with content {title, excerpt, description, slides[], ...}
 * */
export async function getPost(id) {
    let url = cleanDoubleSlashes(`${process.env.API_SERVER}/${process.env.API_ENDPOINTS.posts}/${id}`)
    const res = await fetch(url)
    return await res.json()
}

/*
 * getAllPosts([fields]) - get post content by id
 * parameter:
 *  - <fields> - extra fields returning on request
 * return: <objects array> with every post content {title, excerpt, description, post_type, section}
 * */
export async function getAllPosts(fields = []) {
    let params = arrayToParams(fields)

    let url = cleanDoubleSlashes(`${process.env.API_SERVER}/${process.env.API_ENDPOINTS.posts}?${params}/`)
    const res = await fetch(url)
    return (await res.json()) || []
}

export const postForm = async (form) => {
    let formData = new FormData(form) // form data to object
    let data = Object.fromEntries(formData) // get json formatted data
    data["site"] = getSiteLocation()
    //console.log(data)

    return await Fetch(
        process.env.API_SERVER,
        process.env.API_ENDPOINTS.feedback,
        {},
        {
            method: "post",
            headers: {
                Origin: process.env.SERVER,
                //'Content-Type': 'application/x-www-form-urlencoded',
                //'Content-Type': 'multipart/form-data',
                "Content-Type": "application/json",
                Accept: "application/json, application/xml, text/plain, text/html",
            },
            body: JSON.stringify(data),
        },
    )
}
