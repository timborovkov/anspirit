-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Время создания: Дек 07 2015 г., 11:31
-- Версия сервера: 5.5.46-0ubuntu0.14.04.2
-- Версия PHP: 5.5.9-1ubuntu4.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `qproject`
--

-- --------------------------------------------------------

--
-- Структура таблицы `developers`
--

CREATE TABLE `developers` (
  `id` int(11) NOT NULL,
  `devkey` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8_bin NOT NULL,
  `email` varchar(200) COLLATE utf8_bin NOT NULL,
  `password` varchar(100) COLLATE utf8_bin NOT NULL,
  `balance` double NOT NULL,
  `extCount` int(11) NOT NULL,
  `version` varchar(10) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Дамп данных таблицы `developers`
--

INSERT INTO `developers` (`id`, `devkey`, `name`, `email`, `password`, `balance`, `extCount`, `version`) VALUES
(1, 100, 'Anspirit', 'timofei.borovkov@hotmail.com', '', 0, 1, 'PRO');

-- --------------------------------------------------------

--
-- Структура таблицы `extensions`
--

CREATE TABLE `extensions` (
  `id` int(11) NOT NULL,
  `dev_id` int(11) NOT NULL,
  `name` varchar(100) COLLATE utf8_bin NOT NULL,
  `description` text COLLATE utf8_bin NOT NULL,
  `fullDescription` longtext COLLATE utf8_bin NOT NULL,
  `developer` varchar(100) COLLATE utf8_bin NOT NULL,
  `icon` varchar(500) COLLATE utf8_bin NOT NULL,
  `pathToExt` varchar(500) COLLATE utf8_bin NOT NULL,
  `price` double NOT NULL,
  `soldTimes` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Дамп данных таблицы `extensions`
--

INSERT INTO `extensions` (`id`, `dev_id`, `name`, `description`, `fullDescription`, `developer`, `icon`, `pathToExt`, `price`, `soldTimes`) VALUES
(1, 100, 'Cozify', 'Adding Cozify hub support to your q.', '', 'Anspirit', 'http://blog.code-n.org/wp-content/uploads/2015/01/cozify-quadrat.png', 'http://83.136.248.193/qp/extensions/cozify.js', 0, 0),
(2, 100, 'Google Search', 'This will add Google search support to your q! You can make search requests straight from app using your voice...', '', 'Anspirit', 'http://i.ytimg.com/vi/PAKCgvprpQ8/maxresdefault.jpg', 'http://83.136.248.193/qp/extensions/googleSearch.js', 2, 0);

-- --------------------------------------------------------

--
-- Структура таблицы `money`
--

CREATE TABLE `money` (
  `id` int(11) NOT NULL,
  `sum` double NOT NULL,
  `to` int(11) NOT NULL,
  `from` int(11) NOT NULL,
  `type` varchar(100) COLLATE utf8_bin NOT NULL,
  `description` text COLLATE utf8_bin NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Дамп данных таблицы `money`
--

INSERT INTO `money` (`id`, `sum`, `to`, `from`, `type`, `description`, `date`) VALUES
(1, 0, 2, 1, 'buyExt', 'Buy extension from extension market. Extension ID 2', '2015-12-02'),
(2, 0, 2, 1, 'buyExt', 'Buy extension from extension market. Extension ID 2', '2015-12-02'),
(3, 0, 2, 1, 'buyExt', 'Buy extension from extension market. Extension ID 2', '2015-12-02'),
(4, 0, 2, 1, 'buyExt', 'Buy extension from extension market. Extension ID 2', '2015-12-02'),
(5, 0, 2, 1, 'buyExt', 'Buy extension from extension market. Extension ID 2', '2015-12-03'),
(6, 0, 2, 1, 'buyExt', 'Buy extension from extension market. Extension ID 2', '2015-12-03'),
(7, 0, 2, 1, 'buyExt', 'Buy extension from extension market. Extension ID 2', '2015-12-03');

-- --------------------------------------------------------

--
-- Структура таблицы `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `paymentCode` varchar(50) COLLATE utf8_bin NOT NULL,
  `paymentType` varchar(10) COLLATE utf8_bin NOT NULL,
  `from` int(11) NOT NULL,
  `buyWhat` int(11) NOT NULL,
  `done` tinyint(1) NOT NULL DEFAULT '0',
  `stripeToken` varchar(100) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Структура таблицы `tryToLogin`
--

CREATE TABLE `tryToLogin` (
  `email` varchar(255) COLLATE utf8_bin NOT NULL,
  `date` date NOT NULL,
  `ip` varchar(45) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Дамп данных таблицы `tryToLogin`
--

INSERT INTO `tryToLogin` (`email`, `date`, `ip`) VALUES
('timofei.borovkov@hotmail.com', '2015-12-03', '86.50.146.70'),
('timofei.borovkov@hotmail.com', '2015-12-03', '86.50.146.70'),
('timofei.borovkov@hotmail.com', '2015-12-03', '86.50.146.70'),
('timofei.borovkov@hotmail.com', '2015-12-03', '86.50.146.70'),
('timofei.borovkov@hotmail.com', '2015-12-03', '86.50.146.70'),
('timofei.borovkov@hotmail.com', '2015-12-03', '86.50.146.70'),
('timofei.borovkov@hotmail.com', '2015-12-03', '86.50.146.70'),
('timofei.borovkov@hotmail.com', '2015-12-03', '86.50.146.70'),
('timofei.borovkov@hotmail.com', '2015-12-03', '86.50.146.70'),
('timofei.borovkov@hotmail.com', '2015-12-03', '86.50.146.70'),
('timofei.borovkov@hotmail.com', '2015-12-03', '86.50.146.70'),
('timofei.borovkov@hotmail.com', '2015-12-03', '86.50.146.70'),
('timofei.borovkov@hotmail.com', '2015-12-03', '86.50.146.70'),
('timofei.borovkov@hotmail.com', '2015-12-03', '86.50.146.70'),
('timofei.borovkov@hotmail.com', '2015-12-03', '86.50.146.70'),
('timofei.borovkov@hotmail.com', '2015-12-03', '86.50.146.70'),
('timofei.borovkov@hotmail.com', '2015-12-03', '86.50.146.70'),
('timofei.borovkov@hotmail.com', '2015-12-03', '86.50.146.70'),
('timofei.borovkov@hotmail.com', '2015-12-03', '86.50.146.70'),
('timofei.borovkov@hotmail.com', '2015-12-03', '86.50.146.70'),
('timofei.borovkov@hotmail.com', '2015-12-03', '86.50.146.70'),
('timofei.borovkov@hotmail.com', '2015-12-06', '80.223.209.170');

-- --------------------------------------------------------

--
-- Структура таблицы `userExtensions`
--

CREATE TABLE `userExtensions` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `extensions` longtext COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Дамп данных таблицы `userExtensions`
--

INSERT INTO `userExtensions` (`id`, `userId`, `extensions`) VALUES
(1, 1, 'a:1:{i:0;s:1:"2";}');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) COLLATE utf8_bin NOT NULL,
  `password` varchar(32) COLLATE utf8_bin NOT NULL,
  `fullname` varchar(70) COLLATE utf8_bin NOT NULL,
  `version` varchar(10) COLLATE utf8_bin NOT NULL,
  `age` int(11) NOT NULL,
  `lang` varchar(10) COLLATE utf8_bin NOT NULL DEFAULT 'en',
  `tokenCode` varchar(32) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `fullname`, `version`, `age`, `lang`, `tokenCode`) VALUES
(1, 'timofei.borovkov@hotmail.com', '471eca3b1e76ee3f1a4b86a478b75b53', 'Tim', 'PRO', 14, 'en', '5dcbd0f4900f1096dace2c371d6f6c6c');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `developers`
--
ALTER TABLE `developers`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `extensions`
--
ALTER TABLE `extensions`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `money`
--
ALTER TABLE `money`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `userExtensions`
--
ALTER TABLE `userExtensions`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `developers`
--
ALTER TABLE `developers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT для таблицы `extensions`
--
ALTER TABLE `extensions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT для таблицы `money`
--
ALTER TABLE `money`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
--
-- AUTO_INCREMENT для таблицы `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT для таблицы `userExtensions`
--
ALTER TABLE `userExtensions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
