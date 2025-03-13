-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: teambuilder
-- ------------------------------------------------------
-- Server version	8.0.41

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
-- Table structure for table `pokemon`
--

DROP TABLE IF EXISTS `pokemon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pokemon` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `team_id` bigint NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `level` int NOT NULL,
  `ability` varchar(255) DEFAULT NULL,
  `nature` varchar(255) DEFAULT NULL,
  `item` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `types` varchar(255) DEFAULT NULL,
  `hp` int NOT NULL,
  `attack` int NOT NULL,
  `defense` int NOT NULL,
  `special_attack` int NOT NULL,
  `special_defense` int NOT NULL,
  `speed` int NOT NULL,
  `move1` varchar(255) DEFAULT NULL,
  `move2` varchar(255) DEFAULT NULL,
  `move3` varchar(255) DEFAULT NULL,
  `move4` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `team_id` (`team_id`),
  CONSTRAINT `pokemon_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pokemon`
--

LOCK TABLES `pokemon` WRITE;
/*!40000 ALTER TABLE `pokemon` DISABLE KEYS */;
INSERT INTO `pokemon` VALUES (45,42,'arbok',50,'intimidate','quirky','Absorb Bulb',NULL,'poison',60,95,7,65,414,80,'slam','poison-sting','',''),(66,42,'venusaur',50,'chlorophyll','quirky','Adamant Orb',NULL,'grass/poison',80,82,18,100,339,80,'cut','','',''),(67,42,'zubat',50,'inner-focus','quirky','',NULL,'poison/flying',40,45,27,30,48,55,'','','',''),(68,42,'charizard',50,'blaze','quirky',NULL,NULL,'fire/flying',78,84,70,109,93,100,'','','',''),(74,62,'squirtle',50,'rain-dish','quirky','Ability Shield',NULL,'water',44,48,0,50,3020,43,'mega-punch','ice-punch','body-slam','headbutt'),(75,62,'diglett',50,'sand-veil','quirky','Absorb Bulb',NULL,'ground',10,55,0,35,1796,95,'scratch','cut','sand-attack','headbutt'),(77,62,'sandshrew',50,'sand-veil','quirky','',NULL,'ground',50,75,34,20,60,40,'','','',''),(79,62,'dugtrio',50,'sand-veil','quirky','',NULL,'ground',35,100,25,50,122,120,'','','',''),(80,62,'wartortle',50,'torrent','quirky','',NULL,'water',59,63,51,65,115,58,'','','',''),(82,62,'charmander',50,'blaze','quirky','',NULL,'fire',39,52,34,60,60,65,'','','',''),(83,65,'hydreigon',50,'levitate','quirky','',NULL,'dark/dragon',92,105,36,125,187,98,'','','',''),(84,65,'charizard',50,'blaze','quirky','',NULL,'fire/flying',78,84,36,109,162,100,'','','',''),(85,65,'chikorita',50,'overgrow','quirky','',NULL,'grass',45,49,32,49,112,45,'','','',''),(87,65,'empoleon',50,'torrent','quirky','',NULL,'water/steel',84,86,63,111,134,60,'','','',''),(88,65,'staraptor',50,'intimidate','quirky','',NULL,'normal/flying',85,120,56,50,72,100,'','','',''),(89,65,'ceruledge',50,'flash-fire','quirky',NULL,NULL,'fire/ghost',75,125,72,60,110,85,'','','','');
/*!40000 ALTER TABLE `pokemon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teams`
--

DROP TABLE IF EXISTS `teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teams` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `name` varchar(255) NOT NULL,
  `id_pokemon_1` bigint DEFAULT NULL,
  `id_pokemon_2` bigint DEFAULT NULL,
  `id_pokemon_3` bigint DEFAULT NULL,
  `id_pokemon_4` bigint DEFAULT NULL,
  `id_pokemon_5` bigint DEFAULT NULL,
  `id_pokemon_6` bigint DEFAULT NULL,
  `version` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKlm88j38y90erf2rum00e85gw8` (`user_id`),
  CONSTRAINT `FKlm88j38y90erf2rum00e85gw8` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teams`
--

LOCK TABLES `teams` WRITE;
/*!40000 ALTER TABLE `teams` DISABLE KEYS */;
INSERT INTO `teams` VALUES (42,20,'eq1234',45,66,67,68,NULL,NULL,8),(62,5,'sdfg',74,75,80,77,79,82,12),(65,1,'Equipo 1',83,84,85,87,88,89,8);
/*!40000 ALTER TABLE `teams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'joaquin','1234'),(5,'111','111'),(20,'1234','1234');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-13 18:33:08
