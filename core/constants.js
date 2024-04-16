export const SITE_NAME = "dsmira"
export const SITE_URL = "https://dsmira.com"
export const HOME_TITLE = "Архитектурная студия МИРА"
export const HEADER = {
    logo: "/logo.svg",
}
export const API_ENDPOINTS = {
    pages: "/pages/",
    posts: "/posts/",
    sections: "/sections/",
    feedback: "/feedback/"
}

export const WHATSAPP_URL = "https://api.whatsapp.com/send/?type=phone_number&app_absent=0" //https://wa.me/[номер]/?text=[текст]
export const TELEGRAM_URL = "https://telegram.me/"

export const FEEDBACK_FORM = {
    header: "Задать вопрос",
    name: {
        title: "",
        type: "text",
        required: true,
        placeholder: "Ваше имя",
    },
    /*	organization: {
			title: "Место работы",
			type: "text",
			required: true,
			placeholder: "Название организации/физлицо",
		},
		occupation: {
			title: "Род деятельности",
			type: "select",
			choices: ["дизайнер/декоратор", "руководитель дизайн студии/арт-директор"],
			required: true,
		},*/
    phone: {
        title: "",
        type: "tel",
        required: false,
        placeholder: "Телефон",
    },
    email: {
        title: "",
        type: "email",
        required: true,
        placeholder: "E-mail",
    },
    message: {
        title: "",
        type: "textarea",
        required: true,
        placeholder: "Текст сообщения",
        autocomplete: false,
    },
}
