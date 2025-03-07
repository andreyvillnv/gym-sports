-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: gym_sports
-- ------------------------------------------------------
-- Server version	8.4.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente` (
  `idcliente` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `apellidos` varchar(105) NOT NULL,
  `correo` varchar(45) NOT NULL,
  `pass` varchar(255) NOT NULL,
  `fechaNac` date NOT NULL,
  `idrutina` int DEFAULT NULL,
  `nutricion` int DEFAULT NULL,
  `fisio` int DEFAULT NULL,
  `peso` float NOT NULL,
  `altura` int NOT NULL,
  `celular` int DEFAULT NULL,
  `genero` varchar(45) DEFAULT NULL,
  `intentos` int DEFAULT '0',
  `bloqueo` timestamp NULL DEFAULT NULL,
  `estado` tinyint DEFAULT '0',
  PRIMARY KEY (`idcliente`),
  UNIQUE KEY `correo_UNIQUE` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
INSERT INTO `cliente` VALUES (31,'Marco','Zapata','czuniga@email.com','$2b$10$bIcElxdI9RkpMmws5RfvL.zMJQ8tiwWwrsN1U72Gzd7muwO8dtHie','1995-02-09',NULL,NULL,NULL,90,180,72186750,'Masculino',0,NULL,0),(32,'Marta','Jimenez','info.marta@gmial.com','$2b$10$VydwEwj2hIdGY8NPJjcAWuJ5aHZWwrTG4CeMl9KAZeyYo7mVv5Aoe','1995-06-07',NULL,NULL,NULL,65,160,72548563,'Femenino',0,NULL,0),(57,'Andrey','Villalobos','anvillalobosna@hotmail.com','$2b$10$.aynfOB2/aQ03a3N9vStk.GLx9gD/WRBOj0o.xn3I2qyY00dg6wIK','2025-02-27',NULL,NULL,NULL,68,170,72186750,'Masculino',0,NULL,1);
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contrasenascliente`
--

DROP TABLE IF EXISTS `contrasenascliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contrasenascliente` (
  `idcontrasenasCliente` int NOT NULL AUTO_INCREMENT,
  `idcliente` int NOT NULL,
  `pass` varchar(255) NOT NULL,
  PRIMARY KEY (`idcontrasenasCliente`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contrasenascliente`
--

LOCK TABLES `contrasenascliente` WRITE;
/*!40000 ALTER TABLE `contrasenascliente` DISABLE KEYS */;
INSERT INTO `contrasenascliente` VALUES (1,27,'$2b$10$RWdqSvSWB7mQZtVP0Yr51u211PeB2OzU3EPTUCirkQltagR8fNHPS'),(2,31,'$2b$10$bIcElxdI9RkpMmws5RfvL.zMJQ8tiwWwrsN1U72Gzd7muwO8dtHie'),(3,32,'$2b$10$VydwEwj2hIdGY8NPJjcAWuJ5aHZWwrTG4CeMl9KAZeyYo7mVv5Aoe');
/*!40000 ALTER TABLE `contrasenascliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eventos`
--

DROP TABLE IF EXISTS `eventos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eventos` (
  `ideventos` int NOT NULL AUTO_INCREMENT,
  `idcliente` int NOT NULL,
  `evento` varchar(45) NOT NULL,
  `fecha` datetime NOT NULL,
  PRIMARY KEY (`ideventos`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventos`
--

LOCK TABLES `eventos` WRITE;
/*!40000 ALTER TABLE `eventos` DISABLE KEYS */;
INSERT INTO `eventos` VALUES (1,0,'intento de inicio de sesión','2025-03-05 14:11:29'),(2,57,'intento de inicio de sesión','2025-03-05 14:14:01'),(3,57,'ingreso al perfil','2025-03-05 14:14:20');
/*!40000 ALTER TABLE `eventos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fisioterapia`
--

DROP TABLE IF EXISTS `fisioterapia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fisioterapia` (
  `idfisioterapia` int NOT NULL AUTO_INCREMENT,
  `idcliente` varchar(45) NOT NULL,
  `fecha` datetime NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idfisioterapia`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fisioterapia`
--

LOCK TABLES `fisioterapia` WRITE;
/*!40000 ALTER TABLE `fisioterapia` DISABLE KEYS */;
INSERT INTO `fisioterapia` VALUES (1,'1','2025-02-20 19:30:00','');
/*!40000 ALTER TABLE `fisioterapia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `googleaut`
--

DROP TABLE IF EXISTS `googleaut`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `googleaut` (
  `idgoogleAut` int NOT NULL AUTO_INCREMENT,
  `idcliente` int NOT NULL,
  `googleAuthen` varchar(100) NOT NULL,
  `estado` binary(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`idgoogleAut`),
  UNIQUE KEY `idgoogleAut_UNIQUE` (`idgoogleAut`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `googleaut`
--

LOCK TABLES `googleaut` WRITE;
/*!40000 ALTER TABLE `googleaut` DISABLE KEYS */;
INSERT INTO `googleaut` VALUES (6,32,'NMQWKNCQEVLD6QLHNASUIJBIG54UGT2H',_binary '1');
/*!40000 ALTER TABLE `googleaut` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nutricion`
--

DROP TABLE IF EXISTS `nutricion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nutricion` (
  `idnutricion` int NOT NULL AUTO_INCREMENT,
  `idcliente` varchar(45) NOT NULL,
  `fecha` datetime NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`idnutricion`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nutricion`
--

LOCK TABLES `nutricion` WRITE;
/*!40000 ALTER TABLE `nutricion` DISABLE KEYS */;
INSERT INTO `nutricion` VALUES (25,'11111','2025-03-10 08:15:00',''),(26,'11111','2025-03-10 08:15:00','');
/*!40000 ALTER TABLE `nutricion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rutinas`
--

DROP TABLE IF EXISTS `rutinas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rutinas` (
  `idrutinas` varchar(6) NOT NULL,
  `nombre` varchar(45) NOT NULL,
  PRIMARY KEY (`idrutinas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rutinas`
--

LOCK TABLES `rutinas` WRITE;
/*!40000 ALTER TABLE `rutinas` DISABLE KEYS */;
INSERT INTO `rutinas` VALUES ('3DBP','3 dias bajar peso');
/*!40000 ALTER TABLE `rutinas` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-05 14:41:11
