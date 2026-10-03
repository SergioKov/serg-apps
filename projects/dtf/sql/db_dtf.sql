-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-10-2026 a las 19:29:40
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
-- Base de datos: `db_dtf`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id_cliente` int(11) NOT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `codigo_cliente` int(4) DEFAULT NULL,
  `comentario` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `taquilla` int(2) DEFAULT NULL,
  `descuento` int(3) DEFAULT NULL,
  `precio_fijo_dtf` float DEFAULT NULL,
  `precio_fijo_uv` float DEFAULT NULL,
  `saldo` float DEFAULT NULL,
  `cliente_search` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id_cliente`, `nombre`, `telefono`, `codigo_cliente`, `comentario`, `taquilla`, `descuento`, `precio_fijo_dtf`, `precio_fijo_uv`, `saldo`, `cliente_search`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 'Slavik Demko - papa', '622315345', 5555, 'saasgasg asdg asdg sdag', 1, 10, 10.99, 20.99, 100.99, 'se---rgio k __|__ 622315345 __|__ saasgasg asdg asdg sdag', 0, '2026-09-30 18:28:13', '2026-09-30 18:30:58'),
(2, 'Roman Demko', '+34 612 22 64 36', 6436, 'hermano menor', 2, 0, 0, 0, 0, 'roman demko __|__ 34 612 22 64 36 __|__ hermano menor', 0, '2026-10-01 07:49:17', '2026-10-01 18:01:38'),
(3, 'Nazar Demko-7', '(+34) 643 32 64 51', 6451, 'hermano mayor. JeJe ;¬)', 8, 15, 20, 66, 88, 'nazar demko 7 __|__ 34 643 32 64 51 __|__ hermano mayor jeje', 0, '2026-10-01 08:00:53', '2026-10-02 16:58:25'),
(6, 'Vitaliy Demko', '+34 622315345', 777, 'jdjdhfgj dhjdhfgj', 8, 55, 0, 0, 0, 'vitaliy demko __|__ 34 622315345 __|__ jdjdhfgj dhjdhfgj', 0, '2026-10-01 08:21:48', '2026-10-02 17:18:39'),
(12, '', '234523452435', 0, '', 0, 0, 0, 0, 0, ' __|__ 234523452435', 0, '2026-10-02 17:18:58', NULL),
(13, 'aaaa', '123123123', 0, '', 0, 0, 0, 0, 0, 'aaaa __|__ 123123123', 0, '2026-10-02 17:25:19', NULL),
(14, 'bbb', '435345345', 0, '', 0, 0, 0, 0, 0, 'bbb __|__ 435345345', 0, '2026-10-02 17:45:53', NULL),
(15, 'ccc', '123123123', 0, '', 0, 0, 0, 0, 0, 'ccc __|__ 123123123', 0, '2026-10-02 17:47:37', NULL),
(16, 'ddd-2', '622333444', 0, 'sdg asdfg asg asfdgasdg asdg sdg sdg', 0, 0, 0, 0, 0, 'ddd 2 __|__ 622333444 __|__ sdg asdfg asg asfdgasdg asdg sdg sdg', 0, '2026-10-02 17:52:30', '2026-10-02 18:23:31'),
(17, 'ddd2---3', '622 555 555', 0, 'a <b bbbbb', 0, 0, 0, 0, 0, 'ddd2 3 __|__ 622 555 555 __|__ a b bbbbb', 0, '2026-10-02 17:52:46', '2026-10-03 19:17:31'),
(18, 'dfadfh adfhadfhafdh adfh adfh afdh', '234234234234324234', 0, 'dhadfhadfhadfha', 0, 0, 0, 0, 0, 'dfadfh adfhadfhafdh adfh adfh afdh __|__ 234234234234324234 __|__ dhadfhadfhadfha', 0, '2026-10-02 18:12:28', '2026-10-02 18:39:33');

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
(1, 'Sergio DTF TEST', '123123', '$2y$10$WWNm1kdEj8dgrp.gUnuKZup9oNkYUD.JevCAlGKqkfNj/PEL1mZdy', '', 'sergiokovalchuk@gmail.com', 1, NULL, NULL, '2026-10-03 19:15:36', '2023-12-13 13:08:15', '2026-05-26 16:59:32', NULL, NULL),
(5, 'user_test_no_borrar', '123456', '$2y$10$p6g6ja/i.JqC7b/vYI2y/OSsqfy5yDulOrFuqa0yBGNfZaZTYl9dS', '32303030', 'oldsergbas2001@gmail.com', 1, NULL, NULL, NULL, '2024-01-01 23:35:06', NULL, 'a22ed7e7d81097d248020517366232069c248059683e7adc3be0cb5b83b386ce', '2024-01-02 01:10:57'),
(84, 'Роман Демко', '123456', '$2y$10$LYzqtSDTfS.HJ75.9U/iXOcJBiXLWEBniTD/Fle9xzoBgD/a0GwMm', '', 'romandemko08@gmail.com', 1, NULL, NULL, '2026-10-03 19:27:50', '2026-10-03 19:23:26', NULL, NULL, NULL),
(85, 'Назар Демко', '123456', '$2y$10$RgmfqtVKTRefHnGqTapv8eHmaY7xfoAOCHOfkv3lobIw1DRjLRuxG', '', 'nazardemko0@gmail.com', 1, NULL, NULL, '2026-10-03 19:27:31', '2026-10-03 19:25:39', NULL, NULL, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id_cliente`);
ALTER TABLE `clientes` ADD FULLTEXT KEY `ft_cliente_search` (`cliente_search`);

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
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id_cliente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
