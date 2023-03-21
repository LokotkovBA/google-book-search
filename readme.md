# Тестовое задание на позицию frontend разработчика

Сайт: https://precious-dasik-11a984.netlify.app/

## Дополнительный функционал
Параметры поиска сохраняются в localStorage и при обновлении страницы остаются во входных полях.

## Тестирование
Используются библиотеки Jest, React Testing Library.

## Вёрстка
Доступны тёмная и светлая темы. <br>
Выставляется в зависимости от темы устройства пользователя. <br>
![dark theme main page screenshot](https://media.discordapp.net/attachments/833717272794366007/1087701721091936329/image.png?width=400&height=300)
![dark theme main page screenshot](https://media.discordapp.net/attachments/833717272794366007/1087701815820308582/image.png?width=400&height=300)
![light theme book page screenshot](https://media.discordapp.net/attachments/833717272794366007/1087701665848770600/image.png?width=400&height=300)
![light theme book page screenshot](https://media.discordapp.net/attachments/833717272794366007/1087701911513333780/image.png?width=400&height=300)
 <br>

Не ломается на телефоне. <br>
![phone home page screenshot](https://media.discordapp.net/attachments/833717272794366007/1087704275184009216/IMG_0464.png?width=300&height=650)
![phone home page screenshot](https://media.discordapp.net/attachments/833717272794366007/1087704275616026644/IMG_0470.png?width=300&height=650)
![phone book page screenshot](https://media.discordapp.net/attachments/833717272794366007/1087704276639436830/IMG_0467.png?width=300&height=650)
![phone book page screenshot](https://media.discordapp.net/attachments/833717272794366007/1087704277235023922/IMG_0468.png?width=300&height=650)

## Обработка ошибок
Неправильные параметры поиска. <br>
![empty search string screenshot](https://media.discordapp.net/attachments/833717272794366007/1087707264779034634/image.png?width=591&height=302)
![incorrect select value screenshot](https://media.discordapp.net/attachments/833717272794366007/1087707963906592778/image.png?width=808&height=242) <br>

Ошибка со стороны Google API <br>
![google api error screenshot](https://media.discordapp.net/attachments/833717272794366007/1087707339823517706/image.png?width=550&height=302)


## Дополнительные сторонние библиотеки
Использована библиотека [zod](https://github.com/colinhacks/zod) для валидации входных данных от пользователя. <br>
Удобная библиотека с понятным описанием схем входных данных. Можно использовать как для валидации инпутов, так и для валидации данных, пришедших с API.