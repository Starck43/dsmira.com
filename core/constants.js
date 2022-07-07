export const SITE_NAME = "Site Name"
export const SITE_URL = "http://localhost"
export const HOME_TITLE = "Новый сайт"


export const HEADER = {
	logo: "/logo.svg",
	themeColor: "#a6a6a6",
	msTileColor: "#8c52ff",
	safariColor: "#8c52ff",
}


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
	}
}
