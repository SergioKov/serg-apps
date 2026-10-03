-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 30-09-2026 a las 12:18:43
-- Versión del servidor: 10.4.11-MariaDB
-- Versión de PHP: 7.4.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `db_holy_songs`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id_user` int(10) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password_text` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
  `salt` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
  `email` varchar(50) CHARACTER SET utf8mb4 NOT NULL,
  `is_email_verified` tinyint(1) DEFAULT 0,
  `email_token` varchar(255) DEFAULT NULL,
  `email_token_expiry` datetime DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `reset_token` varchar(255) CHARACTER SET utf8mb4 DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id_user`, `username`, `password_text`, `password`, `salt`, `email`, `is_email_verified`, `email_token`, `email_token_expiry`, `last_login`, `created_at`, `updated_at`, `reset_token`, `reset_token_expiry`) VALUES
(1, 'SergioKov', '123123', '$2y$10$WWNm1kdEj8dgrp.gUnuKZup9oNkYUD.JevCAlGKqkfNj/PEL1mZdy', '', 'sergiokovalchuk@gmail.com', 1, NULL, NULL, '2026-09-29 12:04:51', '2023-12-13 13:08:15', '2026-05-26 16:59:32', NULL, NULL),
(5, 'user_test_no_borrar', '123456', '$2y$10$p6g6ja/i.JqC7b/vYI2y/OSsqfy5yDulOrFuqa0yBGNfZaZTYl9dS', '32303030', 'oldsergbas2001@gmail.com', 1, NULL, NULL, NULL, '2024-01-01 23:35:06', NULL, 'a22ed7e7d81097d248020517366232069c248059683e7adc3be0cb5b83b386ce', '2024-01-02 01:10:57'),
(82, 's7', '123123', '$2y$10$UIywdvHiOFs/TzsksjHq2eBL5CCbXE9THE/FzlgFuvBHykujFyN4K', '', 'sergbas2001@gmail.com', 1, NULL, NULL, '2026-06-09 12:03:40', '2026-05-27 02:04:15', NULL, NULL, NULL),
(83, 'sergbas2000', '123123', '$2y$10$/fYkXnmS2mNf7yaAs.9Ze.Kzb.w6dTYlX/2N4ylrVUmwvhK.vhj3W', '', 'sergbas2000@gmail.com', 1, NULL, NULL, NULL, '2026-05-28 13:04:55', NULL, NULL, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
