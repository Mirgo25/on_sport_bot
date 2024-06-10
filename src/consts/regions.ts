import { Markup } from 'telegraf';

const enum Regions {
  VINNYTSIA = 'Вінницька',
  VOLYN = 'Волинська',
  DNIPRO = 'Дніпропетровська',
  ZHYTOMYR = 'Житомирська',
  ZAKARPATTYA = 'Закарпатська',
  ZAPORIZHIA = 'Запорізька',
  IVANO_FRANKIVSK = 'Івано-Франківська',
  KYIV = 'Київська',
  KROPYVNYTSKIY = 'Кіровоградська',
  LVIV = 'Львівська',
  MYKOLAIV = 'Миколаївська',
  ODESA = 'Одеська',
  POLTAVA = 'Полтавська',
  RIVNE = 'Рівненська',
  SUMY = 'Сумська',
  TERNOPIL = 'Тернопільська',
  KHARKIV = 'Харківська',
  KHERSON = 'Херсонська',
  KHMELNYTSKIY = 'Хмельницька',
  CHERKASY = 'Черкаська',
  CHERNIVTSI = 'Чернівецька',
  CHERNIHIV = 'Чернігівська',
}

export const getRegionsInlineKeyboard = (link: string) =>
  Markup.inlineKeyboard([
    [
      Markup.button.url(Regions.VINNYTSIA, link),
      Markup.button.url(Regions.VOLYN, link),
    ],
    [
      Markup.button.url(Regions.DNIPRO, link),
      Markup.button.url(Regions.ZHYTOMYR, link),
    ],
    [
      Markup.button.url(Regions.ZAKARPATTYA, link),
      Markup.button.url(Regions.ZAPORIZHIA, link),
    ],
    [
      Markup.button.url(Regions.IVANO_FRANKIVSK, link),
      Markup.button.url(Regions.KYIV, link),
    ],
    [
      Markup.button.url(Regions.KROPYVNYTSKIY, link),
      Markup.button.url(Regions.LVIV, link),
    ],
    [
      Markup.button.url(Regions.MYKOLAIV, link),
      Markup.button.url(Regions.ODESA, link),
    ],
    [
      Markup.button.url(Regions.POLTAVA, link),
      Markup.button.url(Regions.RIVNE, link),
    ],
    [
      Markup.button.url(Regions.SUMY, link),
      Markup.button.url(Regions.TERNOPIL, link),
    ],
    [
      Markup.button.url(Regions.KHARKIV, link),
      Markup.button.url(Regions.KHERSON, link),
    ],
    [
      Markup.button.url(Regions.KHMELNYTSKIY, link),
      Markup.button.url(Regions.CHERKASY, link),
    ],
    [
      Markup.button.url(Regions.CHERNIVTSI, link),
      Markup.button.url(Regions.CHERNIHIV, link),
    ],
  ]);
