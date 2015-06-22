'use strict';

var assign = require('object-assign/index');

module.exports = I18n;

function I18n(options) {
	var settings = assign({}, this.defaultSettings, options);
	this.keys = this.strings[settings.locale] || this.strings.en;
}

I18n.prototype.defaultSettings = {
	locale: 'en'
};

I18n.prototype.translate = function (key) {
	return this.keys[key] || key;
};

// TODO: these are Google Translate translations--they MUST be replaced...
I18n.prototype.strings = {
	ar: {
		'Help': 'مساعدة',
		'Menu': 'قائمة الطعام',
		'My Account': 'حسابي',
		'Sign In': 'تسجيل الدخول',
		'Sign Out': 'تسجيل الخروج'
	},
	de: {
		'Help': 'Hilfe',
		'Menu': 'Menü',
		'My Account': 'Mein Konto',
		'Sign In': 'Einloggen',
		'Sign Out': 'Abmelden'
	},
	en: {
		'Help': 'Help',
		'Menu': 'Menu',
		'My Account': 'My Account',
		'Sign In': 'Sign In',
		'Sign Out': 'Sign Out'
	},
	fr: {
		'Help': 'Aidez-Moi',
		'Menu': 'Menu',
		'My Account': 'Mon Compte',
		'Sign In': 'S\'inscrire',
		'Sign Out': 'Se Déconnecter'
	},
	it: {
		'Help': 'Aiuto',
		'Menu': 'Menu',
		'My Account': 'Il Mio Account',
		'Sign In': 'Registrati',
		'Sign Out': 'Disconnessione'
	},
	ja: {
		'Help': '助けて',
		'Menu': 'メニュー',
		'My Account': 'マイアカウント',
		'Sign In': 'ログイン',
		'Sign Out': 'サインアウト'
	},
	ko: {
		'Help': '도와주세요',
		'Menu': '메뉴',
		'My Account': '내 계정',
		'Sign In': '로그인',
		'Sign Out': '어'
	},
	nl: {
		'Help': 'Help',
		'Menu': 'Menu',
		'My Account': 'Mijn Account',
		'Sign In': 'Aanmelden',
		'Sign Out': 'Uitloggen'
	},
	pl: {
		'Help': 'Pomoc',
		'Menu': 'Menu',
		'My Account': 'Moje Konto',
		'Sign In': 'Zaloguj',
		'Sign Out': 'Wyloguj Się'
	},
	pt: {
		'Help': 'Socorro',
		'Menu': 'Cardápio',
		'My Account': 'Minha Conta',
		'Sign In': 'Assinar Em',
		'Sign Out': 'Sair'
	},
	ru: {
		'Help': 'помогите',
		'Menu': 'меню',
		'My Account': 'Мой Счет',
		'Sign In': 'Войти',
		'Sign Out': 'Выйти'
	},
	tr: {
		'Help': 'Yardım',
		'Menu': 'Menü',
		'My Account': 'Hesabım',
		'Sign In': 'Giriş Yap',
		'Sign Out': 'Oturumu Kapat'
	},
	'zh-Hans': {
		'Help': '救命',
		'Menu': '菜单',
		'My Account': '我的帐户',
		'Sign In': '签到',
		'Sign Out': '登出'
	}
};
