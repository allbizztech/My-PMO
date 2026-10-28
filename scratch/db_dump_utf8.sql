-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: my_pmo_db
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `audit_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(50) NOT NULL,
  `module` varchar(50) NOT NULL,
  `details` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES (1,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-05-20 07:28:51'),(2,NULL,'CREATE','Projects','Projek baru dicipta: PRJ-1779262503',NULL,'2026-05-20 07:35:03'),(3,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-05-20 07:35:16'),(4,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-05-20 07:35:39'),(5,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-05-20 07:36:10'),(6,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-05-20 07:55:58'),(7,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-05-20 07:58:17'),(8,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-05-20 08:17:31'),(9,NULL,'UPDATE','Projects','Projek dikemas kini: ID 1',NULL,'2026-05-20 08:21:00'),(10,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-01 08:30:14'),(11,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-06 07:13:42'),(12,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-14 02:13:44'),(13,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-20 02:08:19'),(14,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-20 02:56:02'),(15,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-24 02:04:28'),(16,NULL,'CREATE','Projects','Projek baru dicipta: PRJ-1784858834',NULL,'2026-07-24 02:07:16'),(17,NULL,'UPDATE','Projects','Projek dikemas kini: ID 2',NULL,'2026-07-24 02:07:49'),(18,NULL,'DELETE','Users','Pengguna dipadam: ID 3',NULL,'2026-07-24 02:09:36'),(19,NULL,'UPDATE','Projects','Projek dikemas kini: ID 2',NULL,'2026-07-24 02:10:04'),(20,NULL,'UPDATE','Projects','Projek dikemas kini: ID 2',NULL,'2026-07-24 02:10:04'),(21,NULL,'UPDATE','Projects','Projek dikemas kini: ID 1',NULL,'2026-07-24 02:12:00'),(22,NULL,'CREATE','Projects','Projek baru dicipta: PRJ-1784859222',NULL,'2026-07-24 02:13:42'),(23,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-24 02:37:55'),(24,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-24 02:42:41'),(25,NULL,'UPDATE','Projects','Projek dikemas kini: ID 3',NULL,'2026-07-24 02:44:28'),(26,NULL,'DELETE','Projects','Projek dipadam: ID 2',NULL,'2026-07-24 02:44:50'),(27,NULL,'DELETE','Projects','Projek dipadam: ID 1',NULL,'2026-07-24 02:44:53'),(28,1,'CREATE','Finances','Tuntutan baru dicipta: INV-2026-317 (RM20,000.00) bagi projek ID: 3','::1','2026-07-24 03:07:43'),(29,NULL,'CREATE','Tasks','Tugasan baru dicipta untuk projek ID: 3',NULL,'2026-07-24 03:09:49'),(30,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 1',NULL,'2026-07-24 03:10:07'),(31,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 1',NULL,'2026-07-24 03:10:34'),(32,1,'CREATE','Documents','Fail dimuat naik: Minis Mesyuarat Kickoff.docx (ID: 1) bagi projek ID: 3','::1','2026-07-24 03:13:18'),(33,1,'READ','Documents','Fail dimuat turun: Minis Mesyuarat Kickoff.docx (ID: 1) bagi projek ID: 3','::1','2026-07-24 03:13:51'),(34,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-24 03:30:00'),(35,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 1',NULL,'2026-07-24 03:30:46'),(36,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-24 03:34:17'),(37,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-24 03:35:24'),(38,NULL,'UPDATE','Projects','Projek dikemas kini: ID 3',NULL,'2026-07-24 03:51:29'),(39,NULL,'DELETE','Gantt','Item Gantt dipadam: ID 7',NULL,'2026-07-24 03:52:17'),(40,NULL,'CREATE','Projects','Projek baru dicipta: PRJ-1784865836',NULL,'2026-07-24 04:03:56'),(41,NULL,'UPDATE','Projects','Projek dikemas kini: ID 4',NULL,'2026-07-24 04:09:23'),(42,NULL,'UPDATE','Projects','Projek dikemas kini: ID 3',NULL,'2026-07-24 04:09:56'),(43,NULL,'UPDATE','Projects','Projek dikemas kini: ID 3',NULL,'2026-07-24 04:10:29'),(44,NULL,'UPDATE','Projects','Projek dikemas kini: ID 3',NULL,'2026-07-24 04:10:53'),(45,NULL,'UPDATE','Projects','Projek dikemas kini: ID 3',NULL,'2026-07-24 04:11:05'),(46,NULL,'UPDATE','Projects','Projek dikemas kini: ID 4',NULL,'2026-07-24 04:11:30'),(47,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-24 07:27:26'),(48,NULL,'UPDATE','Gantt','Item Gantt dikemas kini: ID 13',NULL,'2026-07-24 07:35:16'),(49,NULL,'UPDATE','Gantt','Item Gantt dikemas kini: ID 13',NULL,'2026-07-24 07:35:27'),(50,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-24 07:57:09'),(51,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-24 08:14:43'),(52,NULL,'CREATE','Project Members','Ahli pasukan ditambah ke projek ID: 4 (User ID: 4)',NULL,'2026-07-24 08:15:40'),(53,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-24 08:15:52'),(54,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-24 08:16:31'),(55,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-24 08:17:35'),(56,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-24 08:19:47'),(57,NULL,'UPDATE','Users','Profil pengguna dikemas kini: ID 1',NULL,'2026-07-24 08:21:15'),(58,NULL,'CREATE','Project Members','Ahli pasukan ditambah ke projek ID: 4 (User ID: 1)',NULL,'2026-07-24 08:28:45'),(59,NULL,'CREATE','Projects','Projek baru dicipta: PRJ-1784881939',NULL,'2026-07-24 08:32:19'),(60,NULL,'UPDATE','Projects','Projek dikemas kini: ID 5',NULL,'2026-07-24 08:32:46'),(61,NULL,'CREATE','Projects','Projek baru dicipta: PRJ-1784882117',NULL,'2026-07-24 08:35:17'),(62,NULL,'CREATE','Projects','Projek baru dicipta: PRJ-1784882248',NULL,'2026-07-24 08:37:28'),(63,NULL,'UPDATE','Projects','Projek dikemas kini: ID 7',NULL,'2026-07-24 08:38:05'),(64,NULL,'UPDATE','Projects','Projek dikemas kini: ID 6',NULL,'2026-07-24 08:38:18'),(65,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-24 08:50:19'),(66,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-24 08:50:44'),(67,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-24 08:53:47'),(68,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-24 09:09:32'),(69,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-24 09:11:27'),(70,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-24 09:16:09'),(71,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-24 09:18:43'),(72,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-24 09:20:17'),(73,NULL,'CREATE','Project Members','Ahli pasukan ditambah ke projek ID: 7 (User ID: 1)',NULL,'2026-07-24 09:25:36'),(74,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-24 09:27:38'),(75,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-24 09:33:07'),(76,NULL,'UPDATE','Projects','Projek dikemas kini: ID 4',NULL,'2026-07-24 09:39:12'),(77,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-24 09:47:24'),(78,NULL,'UPDATE','Projects','Projek dikemas kini: ID 4',NULL,'2026-07-24 09:47:57'),(79,NULL,'UPDATE','Projects','Projek dikemas kini: ID 5',NULL,'2026-07-24 09:48:56'),(80,NULL,'UPDATE','Projects','Projek dikemas kini: ID 3',NULL,'2026-07-24 09:49:35'),(81,NULL,'UPDATE','Projects','Projek dikemas kini: ID 4',NULL,'2026-07-24 09:52:08'),(82,NULL,'UPDATE','Projects','Projek dikemas kini: ID 4',NULL,'2026-07-24 09:59:43'),(83,NULL,'UPDATE','Projects','Projek dikemas kini: ID 4',NULL,'2026-07-24 10:00:14'),(84,NULL,'UPDATE','Projects','Projek dikemas kini: ID 4',NULL,'2026-07-24 10:02:54'),(85,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-24 10:03:07'),(86,NULL,'UPDATE','Projects','Projek dikemas kini: ID 4',NULL,'2026-07-24 10:03:43'),(87,NULL,'UPDATE','Projects','Projek dikemas kini: ID 4',NULL,'2026-07-24 10:04:08'),(88,NULL,'UPDATE','Projects','Projek dikemas kini: ID 4',NULL,'2026-07-24 10:09:21'),(89,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-24 10:09:32'),(90,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-24 10:10:44'),(91,NULL,'UPDATE','Projects','Projek dikemas kini: ID 4',NULL,'2026-07-24 10:11:12'),(92,NULL,'UPDATE','Projects','Projek dikemas kini: ID 4',NULL,'2026-07-24 10:11:32'),(93,NULL,'UPDATE','Projects','Projek dikemas kini: ID 6',NULL,'2026-07-24 10:12:37'),(94,NULL,'UPDATE','Projects','Projek dikemas kini: ID 6',NULL,'2026-07-24 10:15:45'),(95,NULL,'UPDATE','Projects','Projek dikemas kini: ID 6',NULL,'2026-07-24 10:16:08'),(96,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-24 11:14:44'),(97,NULL,'UPDATE','Users','Profil pengguna dikemas kini: ID 2',NULL,'2026-07-24 11:32:28'),(98,NULL,'UPDATE','Users','Profil pengguna dikemas kini: ID 10',NULL,'2026-07-24 11:33:16'),(99,NULL,'UPDATE','Users','Profil pengguna dikemas kini: ID 5',NULL,'2026-07-24 11:34:11'),(100,NULL,'CREATE','Users','Pengguna baru dicipta: zara@gmail.com',NULL,'2026-07-24 11:39:07'),(101,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-24 11:40:23'),(102,11,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-24 11:43:07'),(103,11,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-24 11:44:21'),(104,NULL,'UPDATE','Projects','Projek dikemas kini: ID 7',NULL,'2026-07-24 11:44:59'),(105,NULL,'UPDATE','Projects','Projek dikemas kini: ID 5',NULL,'2026-07-24 11:45:15'),(106,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-27 01:35:03'),(107,NULL,'UPDATE','Projects','Projek dikemas kini: ID 7',NULL,'2026-07-27 02:53:43'),(108,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-27 03:00:07'),(109,1,'CREATE','Finances','Tuntutan baru dicipta: INV-2026-588 (RM110,000.00) bagi projek ID: 7','::1','2026-07-27 03:00:55'),(110,1,'UPDATE','Finances','Rekod kewangan dikemas kini: INV-2026-588 (ID: 2) bagi projek ID: 7','::1','2026-07-27 03:01:35'),(111,1,'UPDATE','Finances','Rekod kewangan dikemas kini: INV-2026-588 (ID: 2) bagi projek ID: 7','::1','2026-07-27 03:02:15'),(112,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-27 03:06:22'),(113,1,'UPDATE','Finances','Rekod kewangan dikemas kini: INV-2026-588 (ID: 2) bagi projek ID: 7','::1','2026-07-27 03:07:07'),(114,1,'CREATE','Finances','Tuntutan baru dicipta: INV-2026-364 (RM120,000.00) bagi projek ID: 7','::1','2026-07-27 03:07:49'),(115,1,'CREATE','Finances','Tuntutan baru dicipta: INV-2026-885 (RM20,000.00) bagi projek ID: 7','::1','2026-07-27 03:09:06'),(116,1,'UPDATE','Finances','Rekod kewangan dikemas kini: INV-2026-885 (ID: 4) bagi projek ID: 7','::1','2026-07-27 03:09:44'),(117,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-27 03:17:32'),(118,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-27 03:31:59'),(119,1,'UPDATE','Finances','Rekod kewangan dikemas kini: INV-2026-364 (ID: 3) bagi projek ID: 7','::1','2026-07-27 03:32:34'),(120,1,'CREATE','Documents','Fail dimuat naik: Minis Mesyuarat Kickoff.docx (ID: 2) bagi projek ID: 7','::1','2026-07-27 03:33:33'),(121,1,'CREATE','Documents','Fail dimuat naik: Invoice Payment.docx (ID: 3) bagi projek ID: 7','::1','2026-07-27 03:34:28'),(122,1,'CREATE','Documents','Fail dimuat naik: Invoice Payment 2.docx (ID: 4) bagi projek ID: 7','::1','2026-07-27 03:35:24'),(123,1,'READ','Documents','Fail dimuat turun: Minis Mesyuarat Kickoff.docx (ID: 2) bagi projek ID: 7','::1','2026-07-27 03:35:43'),(124,1,'CREATE','Documents','Fail dimuat naik: Kontrak Legal.docx (ID: 5) bagi projek ID: 7','::1','2026-07-27 03:36:43'),(125,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-27 03:55:46'),(126,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-27 03:58:25'),(127,1,'READ','Documents','Fail dimuat turun: Kontrak Legal.docx (ID: 5) bagi projek ID: 7','::1','2026-07-27 04:15:31'),(128,1,'UPDATE','Finances','Rekod kewangan dikemas kini: INV-2026-885 (ID: 4) bagi projek ID: 7','::1','2026-07-27 04:16:22'),(129,NULL,'CREATE','Tasks','Tugasan baru dicipta untuk projek ID: 7',NULL,'2026-07-27 04:23:12'),(130,NULL,'DELETE','Tasks','Tugasan dipadam: ID 2',NULL,'2026-07-27 04:23:32'),(131,NULL,'CREATE','Tasks','Tugasan baru dicipta untuk projek ID: 7',NULL,'2026-07-27 04:23:52'),(132,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 3',NULL,'2026-07-27 04:23:57'),(133,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 3',NULL,'2026-07-27 04:24:01'),(134,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 3',NULL,'2026-07-27 04:24:03'),(135,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 3',NULL,'2026-07-27 04:24:05'),(136,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 3',NULL,'2026-07-27 04:24:07'),(137,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 3',NULL,'2026-07-27 04:24:53'),(138,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 3',NULL,'2026-07-27 04:24:55'),(139,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 3',NULL,'2026-07-27 04:26:46'),(140,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 3',NULL,'2026-07-27 04:26:54'),(141,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-27 06:54:41'),(142,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 3',NULL,'2026-07-27 06:56:43'),(143,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 3',NULL,'2026-07-27 06:56:54'),(144,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 3',NULL,'2026-07-27 06:56:56'),(145,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 3',NULL,'2026-07-27 06:56:58'),(146,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 3',NULL,'2026-07-27 06:58:31'),(147,NULL,'DELETE','Tasks','Tugasan dipadam: ID 3',NULL,'2026-07-27 06:59:04'),(148,NULL,'CREATE','Tasks','Tugasan baru dicipta untuk projek ID: 7',NULL,'2026-07-27 06:59:30'),(149,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 4',NULL,'2026-07-27 07:01:57'),(150,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 4',NULL,'2026-07-27 07:04:43'),(151,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 4',NULL,'2026-07-27 07:06:30'),(152,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 4',NULL,'2026-07-27 07:06:35'),(153,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 4',NULL,'2026-07-27 07:06:38'),(154,NULL,'DELETE','Tasks','Tugasan dipadam: ID 4',NULL,'2026-07-27 07:10:32'),(155,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-27 07:10:42'),(156,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-27 07:11:20'),(157,NULL,'CREATE','Tasks','Tugasan baru dicipta untuk projek ID: 7',NULL,'2026-07-27 07:12:23'),(158,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 5',NULL,'2026-07-27 07:15:02'),(159,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 5',NULL,'2026-07-27 07:15:18'),(160,NULL,'CREATE','Tasks','Tugasan baru dicipta untuk projek ID: 7',NULL,'2026-07-27 07:17:52'),(161,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 6',NULL,'2026-07-27 07:18:09'),(162,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 6',NULL,'2026-07-27 07:19:05'),(163,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-27 07:22:30'),(164,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 5',NULL,'2026-07-27 07:23:17'),(165,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 5',NULL,'2026-07-27 07:23:37'),(166,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 5',NULL,'2026-07-27 07:23:42'),(167,1,'CREATE','Documents','Fail dimuat naik: 00_README_Tugasan_Modul11.docx (ID: 6) bagi projek ID: 7','::1','2026-07-27 07:23:42'),(168,NULL,'CREATE','Tasks','Tugasan baru dicipta untuk projek ID: 7',NULL,'2026-07-27 07:24:42'),(169,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 7',NULL,'2026-07-27 07:25:04'),(170,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 7',NULL,'2026-07-27 07:25:19'),(171,1,'CREATE','Documents','Fail dimuat naik: 01_Work_Order_WO-ATP-2026-014.docx (ID: 7) bagi projek ID: 7','::1','2026-07-27 07:25:19'),(172,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 6',NULL,'2026-07-27 07:26:40'),(173,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 7',NULL,'2026-07-27 07:26:43'),(174,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 6',NULL,'2026-07-27 07:26:46'),(175,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 7',NULL,'2026-07-27 07:26:48'),(176,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-27 07:29:15'),(177,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 5',NULL,'2026-07-27 07:29:51'),(178,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-27 07:34:00'),(179,1,'DELETE','Documents','Fail dipadam: 01_Work_Order_WO-ATP-2026-014.docx (ID: 7) bagi projek ID: 7','::1','2026-07-27 07:34:18'),(180,1,'DELETE','Documents','Fail dipadam: 00_README_Tugasan_Modul11.docx (ID: 6) bagi projek ID: 7','::1','2026-07-27 07:34:23'),(181,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 5',NULL,'2026-07-27 07:35:25'),(182,1,'CREATE','Documents','Fail dimuat naik: 01_Work_Order_WO-ATP-2026-014.docx (ID: 8) bagi projek ID: 7','::1','2026-07-27 07:35:25'),(183,1,'CREATE','Documents','Fail dimuat naik: 02_Email_Vendor_Acknowledgement_and_Access_Request.docx (ID: 9) bagi projek ID: 7','::1','2026-07-27 07:35:25'),(184,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 5',NULL,'2026-07-27 07:36:00'),(185,1,'DELETE','Documents','Fail dipadam: 01_Work_Order_WO-ATP-2026-014.docx (ID: 8) bagi projek ID: 7','::1','2026-07-27 07:36:00'),(186,1,'DELETE','Documents','Fail dipadam: 02_Email_Vendor_Acknowledgement_and_Access_Request.docx (ID: 9) bagi projek ID: 7','::1','2026-07-27 07:36:00'),(187,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 7',NULL,'2026-07-27 07:36:16'),(188,1,'CREATE','Documents','Fail dimuat naik: 00_README_Tugasan_Modul11.docx (ID: 10) bagi projek ID: 7','::1','2026-07-27 07:36:16'),(189,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-27 07:39:27'),(190,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-27 07:42:41'),(191,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-27 07:45:22'),(192,1,'UPDATE','Documents','Dokumen dikemaskini: 00_README_Tugasan_Modul11.docx (ID: 10)','::1','2026-07-27 07:45:54'),(193,1,'UPDATE','Documents','Dokumen dikemaskini: 00_README_Tugasan_Modul11.docx (ID: 10)','::1','2026-07-27 07:46:04'),(194,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 5',NULL,'2026-07-27 07:46:35'),(195,1,'CREATE','Documents','Fail dimuat naik: 01_Work_Order_WO-ATP-2026-014.txt (ID: 11) bagi projek ID: 7','::1','2026-07-27 07:46:35'),(196,1,'CREATE','Documents','Fail dimuat naik: 02_Email_Vendor_Acknowledgement_and_Access_Request.txt (ID: 12) bagi projek ID: 7','::1','2026-07-27 07:46:35'),(197,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-27 07:48:21'),(198,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-27 07:51:38'),(199,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 5',NULL,'2026-07-27 07:52:37'),(200,1,'DELETE','Documents','Fail dipadam: 01_Work_Order_WO-ATP-2026-014.txt (ID: 11) bagi projek ID: 7','::1','2026-07-27 07:52:37'),(201,1,'DELETE','Documents','Fail dipadam: 02_Email_Vendor_Acknowledgement_and_Access_Request.txt (ID: 12) bagi projek ID: 7','::1','2026-07-27 07:52:37'),(202,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 7',NULL,'2026-07-27 07:52:52'),(203,1,'DELETE','Documents','Fail dipadam: 00_README_Tugasan_Modul11.docx (ID: 10) bagi projek ID: 7','::1','2026-07-27 07:52:52'),(204,1,'CREATE','Documents','Fail dimuat naik: 01_Work_Order_WO-ATP-2026-014.txt (ID: 13) bagi projek ID: 7','::1','2026-07-27 07:53:08'),(205,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 5',NULL,'2026-07-27 07:53:08'),(206,1,'CREATE','Documents','Fail dimuat naik: 02_Email_Vendor_Acknowledgement_and_Access_Request.txt (ID: 14) bagi projek ID: 7','::1','2026-07-27 07:53:08'),(207,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 6',NULL,'2026-07-27 07:53:23'),(208,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-27 08:09:59'),(209,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 7',NULL,'2026-07-27 08:12:02'),(210,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 7',NULL,'2026-07-27 08:12:34'),(211,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-27 08:16:06'),(212,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-27 08:16:36'),(213,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 7',NULL,'2026-07-27 08:19:21'),(214,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 7',NULL,'2026-07-27 08:19:53'),(215,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 7',NULL,'2026-07-27 08:20:10'),(216,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 7',NULL,'2026-07-27 08:20:30'),(217,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 7',NULL,'2026-07-27 08:20:38'),(218,1,'CREATE','Documents','Fail dimuat naik: 00_README_Tugasan_Modul11.txt (ID: 15) bagi projek ID: 7','::1','2026-07-27 08:20:38'),(219,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-27 09:16:34'),(220,NULL,'UPDATE','Projects','Projek dikemas kini: ID 7',NULL,'2026-07-27 09:17:38'),(221,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-27 09:36:07'),(222,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-27 09:57:19'),(223,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-27 10:01:35'),(224,NULL,'UPDATE','Projects','Projek dikemas kini: ID 7',NULL,'2026-07-27 10:04:10'),(225,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-27 10:14:54'),(226,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-27 10:20:51'),(227,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-27 10:25:05'),(228,NULL,'UPDATE','Projects','Projek dikemas kini: ID 7',NULL,'2026-07-27 10:30:41'),(229,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-27 10:35:18'),(230,NULL,'UPDATE','Projects','Projek dikemas kini: ID 7',NULL,'2026-07-27 10:36:14'),(231,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-27 10:42:48'),(232,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-27 10:51:29'),(233,NULL,'UPDATE','Projects','Projek dikemas kini: ID 7',NULL,'2026-07-27 10:52:47'),(234,NULL,'UPDATE','Projects','Projek dikemas kini: ID 6',NULL,'2026-07-27 10:56:30'),(235,NULL,'UPDATE','Projects','Projek dikemas kini: ID 5',NULL,'2026-07-27 10:56:47'),(236,NULL,'UPDATE','Projects','Projek dikemas kini: ID 4',NULL,'2026-07-27 10:57:02'),(237,NULL,'UPDATE','Projects','Projek dikemas kini: ID 3',NULL,'2026-07-27 10:57:15'),(238,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-27 11:01:44'),(239,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-27 11:14:32'),(240,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-28 04:05:22'),(241,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-29 04:04:39'),(242,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-29 09:13:23'),(243,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-30 01:27:59'),(244,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-30 02:11:51'),(245,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-30 02:21:07'),(246,NULL,'UPDATE','Gantt','Item Gantt dikemas kini: ID 19',NULL,'2026-07-30 02:24:32'),(247,NULL,'UPDATE','Gantt','Item Gantt dikemas kini: ID 22',NULL,'2026-07-30 02:25:20'),(248,NULL,'UPDATE','Gantt','Item Gantt dikemas kini: ID 20',NULL,'2026-07-30 02:25:43'),(249,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-31 02:19:52'),(250,NULL,'CREATE','Tasks','Tugasan baru dicipta untuk projek ID: 7',NULL,'2026-07-31 02:23:53'),(251,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 8',NULL,'2026-07-31 02:25:16'),(252,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 8',NULL,'2026-07-31 02:25:42'),(253,1,'CREATE','Documents','Fail dimuat naik: IzzDefender_Report_507.pdf (ID: 16) bagi projek ID: 7','::1','2026-07-31 02:25:42'),(254,1,'UPDATE','Finances','Rekod kewangan dikemas kini: INV-2026-588 (ID: 2) bagi projek ID: 7','::1','2026-07-31 02:26:54'),(255,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-31 07:50:32'),(256,1,'CREATE','Backup','Fail sandaran dicipta: backup_mypmo_2026-07-31_09-56-51.zip (0.77 MB)','127.0.0.1','2026-07-31 07:56:51'),(257,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-07-31 08:00:12'),(258,1,'CREATE','Backup','Fail sandaran dicipta: backup_mypmo_2026-07-31_10-02-01.zip (0.77 MB)','::1','2026-07-31 08:02:01'),(259,1,'UPDATE','Backup','Tetapan automatik sandaran ditukar: Frekuensi = daily','::1','2026-07-31 08:02:39'),(260,1,'CREATE','Backup','Fail sandaran dicipta: backup_mypmo_2026-07-31_10-05-25.zip (0.77 MB)','127.0.0.1','2026-07-31 08:05:25'),(261,1,'CREATE','Backup','Fail sandaran dicipta: backup_mypmo_2026-07-31_10-06-54.zip (0.77 MB)','127.0.0.1','2026-07-31 08:06:54'),(262,1,'CREATE','Backup','Fail sandaran dicipta: backup_mypmo_2026-07-31_10-08-28.zip (0.77 MB)','::1','2026-07-31 08:08:28'),(263,1,'CREATE','Backup','Fail sandaran dicipta: backup_mypmo_2026-07-31_10-11-28.zip (0.95 MB)','127.0.0.1','2026-07-31 08:11:29'),(264,1,'UPDATE','Backup','Tetapan automatik sandaran ditukar: Frekuensi = daily','::1','2026-07-31 08:12:53'),(265,1,'CREATE','Backup','Fail sandaran dicipta: backup_mypmo_2026-07-31_10-16-29.zip (0.95 MB)','127.0.0.1','2026-07-31 08:16:30'),(266,1,'CREATE','Backup','Fail sandaran dicipta: backup_mypmo_2026-07-31_10-17-32.zip (0.95 MB)','::1','2026-07-31 08:17:35'),(267,1,'UPDATE','Backup','Tetapan automatik sandaran ditukar: Frekuensi = daily','::1','2026-07-31 08:18:25'),(268,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-08-03 10:57:15'),(269,NULL,'UPDATE','Projects','Projek dikemas kini: ID 7',NULL,'2026-08-03 10:59:43'),(270,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-08-04 03:15:56'),(271,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-08-04 07:03:18'),(272,1,'CREATE','Backup','Fail sandaran dicipta: backup_mypmo_2026-08-04_09-03-25.zip (0.95 MB)','::1','2026-08-04 07:03:30'),(273,1,'DELETE','Documents','Fail dipadam: IzzDefender_Report_507.pdf (ID: 16) bagi projek ID: 7','::1','2026-08-04 07:15:27'),(274,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 8',NULL,'2026-08-04 07:15:27'),(275,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 8',NULL,'2026-08-04 07:15:29'),(276,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 8',NULL,'2026-08-04 07:16:45'),(277,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 8',NULL,'2026-08-04 07:16:45'),(278,1,'CREATE','Documents','Fail dimuat naik: IzzDefender_Report_507.txt (ID: 17) bagi projek ID: 7','::1','2026-08-04 07:16:45'),(279,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-08-04 07:47:38'),(280,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-08-05 01:16:17'),(281,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-08-05 01:26:21'),(282,1,'CREATE','Documents','Fail dimuat naik: Butiran_Denda_DND-2026-164.xlsx (ID: 18) bagi projek ID: 7','::1','2026-08-05 01:30:46'),(283,1,'CREATE','Finances','Denda SLA baru dicipta: DND-2026-164 (RM3,000.00) bagi projek ID: 7','::1','2026-08-05 01:30:46'),(284,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-08-05 01:33:45'),(285,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-08-06 03:23:16'),(286,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-08-06 03:47:46'),(287,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-08-10 06:55:27'),(288,1,'CREATE','Backup','Fail sandaran dicipta: backup_mypmo_2026-08-10_08-59-43.zip (0.96 MB)','::1','2026-08-10 06:59:47'),(289,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-08-10 09:24:52'),(290,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 8',NULL,'2026-08-10 09:27:09'),(291,1,'DELETE','Documents','Fail dipadam: IzzDefender_Report_507.txt (ID: 17) bagi projek ID: 7','::1','2026-08-10 09:27:09'),(292,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 8',NULL,'2026-08-10 09:27:40'),(293,1,'CREATE','Backup','Fail sandaran dicipta: backup_mypmo_2026-08-10_11-32-16.zip (0.96 MB)','::1','2026-08-10 09:32:19'),(294,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-08-10 15:31:33'),(295,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-08-11 10:52:20'),(296,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-08-14 10:35:38'),(297,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 8',NULL,'2026-08-14 10:36:10'),(298,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 8',NULL,'2026-08-14 10:36:11'),(299,1,'CREATE','Backup','Fail sandaran dicipta: backup_mypmo_2026-08-14_12-38-08.zip (0.96 MB)','::1','2026-08-14 10:38:15'),(300,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-08-17 03:42:37'),(301,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-08-17 05:22:01'),(302,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 8',NULL,'2026-08-17 05:25:22'),(303,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 8',NULL,'2026-08-17 05:25:25'),(304,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 8',NULL,'2026-08-17 05:25:27'),(305,1,'CREATE','Backup','Fail sandaran dicipta: backup_mypmo_2026-08-17_07-31-56.zip (0.96 MB)','::1','2026-08-17 05:32:02'),(306,1,'CREATE','Backup','Fail sandaran dicipta: backup_mypmo_2026-08-17_07-32-33.zip (0.96 MB)','::1','2026-08-17 05:32:35'),(307,NULL,'CREATE','Tasks','Tugasan baru dicipta untuk projek ID: 7',NULL,'2026-08-17 05:36:51'),(308,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 9',NULL,'2026-08-17 05:37:18'),(309,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 9',NULL,'2026-08-17 05:37:36'),(310,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-08-20 04:55:46'),(311,1,'CREATE','Backup','Fail sandaran dicipta: backup_mypmo_2026-08-20_06-56-34.zip (0.96 MB)','::1','2026-08-20 04:56:40'),(312,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-08-20 06:53:26'),(313,1,'UPDATE','Backup','Tetapan automatik sandaran ditukar: Frekuensi = weekly','::1','2026-08-20 07:00:58'),(314,1,'UPDATE','Backup','Tetapan automatik sandaran ditukar: Frekuensi = daily','::1','2026-08-20 07:01:12'),(315,1,'CREATE','Backup','Fail sandaran dicipta: backup_mypmo_2026-08-20_09-44-25.zip (0.96 MB)','::1','2026-08-20 07:44:27'),(316,1,'CREATE','Backup','Fail sandaran dicipta: backup_mypmo_2026-08-20_09-44-50.zip (0.96 MB)','::1','2026-08-20 07:44:51'),(317,1,'CREATE','Backup','Fail sandaran dicipta: backup_mypmo_2026-08-20_09-44-54.zip (0.96 MB)','::1','2026-08-20 07:44:55'),(318,1,'CREATE','Backup','Fail sandaran dicipta: backup_mypmo_2026-08-20_09-44-57.zip (0.96 MB)','::1','2026-08-20 07:44:59'),(319,1,'CREATE','Backup','Fail sandaran dicipta: backup_mypmo_2026-08-20_09-45-00.zip (0.96 MB)','::1','2026-08-20 07:45:01'),(320,1,'CREATE','Backup','Fail sandaran dicipta: backup_mypmo_2026-08-20_09-45-04.zip (0.96 MB)','::1','2026-08-20 07:45:05'),(321,1,'CREATE','Backup','Fail sandaran dicipta: backup_mypmo_2026-08-20_09-45-07.zip (0.96 MB)','::1','2026-08-20 07:45:09'),(322,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-08-20 08:06:31'),(323,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-08-20 08:07:48'),(324,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-08-20 08:15:57'),(325,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-08-21 08:11:23'),(326,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-08-26 02:11:26'),(327,1,'CREATE','Backup','Fail sandaran dicipta: backup_mypmo_2026-08-26_06-05-52.zip (0.97 MB)','::1','2026-08-26 04:05:55'),(328,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-08-26 08:22:28'),(329,NULL,'UPDATE','Tasks','Tugasan dikemas kini: ID 8',NULL,'2026-08-26 08:25:01'),(330,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-16 12:01:04'),(331,1,'CREATE','Backup','Fail sandaran dicipta: backup_mypmo_2026-09-16_14-01-34.zip (0.97 MB)','::1','2026-09-16 12:01:38'),(332,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-16 16:23:20'),(333,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-16 16:38:33'),(334,1,'CREATE','Finances','Tuntutan baru dicipta: INV-2026-510 (RM250,000.00) bagi projek ID: 7','::1','2026-09-16 17:07:56'),(335,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-16 17:30:07'),(336,NULL,'CREATE','Projects','Projek baru dicipta: PRJ-1789581049',NULL,'2026-09-16 17:50:49'),(337,NULL,'CREATE','Project Members','Ahli pasukan ditambah ke projek ID: 8 (User ID: 4)',NULL,'2026-09-16 17:52:51'),(338,NULL,'CREATE','Project Members','Ahli pasukan ditambah ke projek ID: 8 (User ID: 1)',NULL,'2026-09-16 17:52:59'),(339,NULL,'CREATE','Gantt','Item Carta Gantt dicipta: fasa1 (Projek ID: 8)',NULL,'2026-09-16 18:18:51'),(340,1,'CREATE','Finances','Tuntutan baru dicipta: INV-2026-131 (RM60,000.00) bagi projek ID: 8','::1','2026-09-16 18:20:36'),(341,1,'UPDATE','Finances','Rekod kewangan dikemas kini: INV-2026-131 (ID: 7) bagi projek ID: 8','::1','2026-09-16 18:22:15'),(342,1,'UPDATE','Finances','Rekod kewangan dikemas kini: INV-2026-131 (ID: 7) bagi projek ID: 8','::1','2026-09-16 18:22:44'),(343,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-16 18:26:18'),(344,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-16 18:26:25'),(345,1,'CREATE','Finances','Tuntutan baru dicipta: INV-2026-304 (RM70,000.00) bagi projek ID: 8','::1','2026-09-16 18:34:27'),(346,1,'CREATE','Finances','Tuntutan baru dicipta: JDL-6705 (RM50,000.00) bagi projek ID: 8','::1','2026-09-16 18:48:26'),(347,1,'UPDATE','Finances','Rekod kewangan dikemas kini: JDL-6705 (ID: 9) bagi projek ID: 8','::1','2026-09-16 18:49:12'),(348,1,'UPDATE','Finances','Rekod kewangan dikemas kini: JDL-6705 (ID: 9) bagi projek ID: 8','::1','2026-09-16 18:49:40'),(349,1,'UPDATE','Finances','Rekod kewangan dikemas kini: JDL-6705 (ID: 9) bagi projek ID: 8','::1','2026-09-16 18:49:58'),(350,1,'UPDATE','Finances','Rekod kewangan dikemas kini: JDL-6705 (ID: 9) bagi projek ID: 8','::1','2026-09-16 18:50:22'),(351,1,'UPDATE','Finances','Rekod kewangan dikemas kini: JDL-6705 (ID: 9) bagi projek ID: 8','::1','2026-09-16 18:50:53'),(352,1,'UPDATE','Finances','Rekod kewangan dikemas kini: JDL-6705 (ID: 9) bagi projek ID: 8','::1','2026-09-16 18:51:09'),(353,1,'UPDATE','Finances','Rekod kewangan dikemas kini: JDL-6705 (ID: 9) bagi projek ID: 8','::1','2026-09-16 19:06:47'),(354,1,'UPDATE','Finances','Rekod kewangan dikemas kini: JDL-6705 (ID: 9) bagi projek ID: 8','::1','2026-09-16 19:07:18'),(355,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-17 04:15:53'),(356,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-17 04:18:14'),(357,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-17 09:08:18'),(358,1,'UPDATE','Tetapan SMTP','Mengemas kini konfigurasi pelayan SMTP (smtp.kehakiman.gov.my:587, noreply-mypmo@kehakiman.gov.my)','::1','2026-09-17 09:38:14'),(359,1,'TEST_SUCCESS','Tetapan SMTP','Ujian sambungan soket SMTP ke 127.0.0.1:80 berjaya. Respon: ','::1','2026-09-17 09:39:21'),(360,1,'TEST_SUCCESS','Tetapan SMTP','Ujian sambungan soket SMTP ke 127.0.0.1:80 berjaya. Respon: Sambungan port terbuka (tiada banner teks SMTP segera dipulangkan).','::1','2026-09-17 09:39:54'),(361,1,'TEST_FAILED','Tetapan SMTP','Ujian sambungan SMTP ke 127.0.0.1:9999 gagal: No connection could be made because the target machine actively refused it (10061)','::1','2026-09-17 09:40:07'),(362,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-17 09:50:12'),(363,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-17 11:52:35'),(364,1,'UPDATE','Tetapan SMTP','Mengemas kini konfigurasi pelayan SMTP (smtp.kehakiman.gov.my:587, noreply-mypmo@kehakiman.gov.my)','::1','2026-09-17 11:53:42'),(365,NULL,'INITIALIZE','Senarai Semak Perolehan','Inisialisasi senarai semak perolehan bagi projek #3 (tender)','::1','2026-09-17 15:57:48'),(366,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F1-01: Selesai','::1','2026-09-17 16:01:05'),(367,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-17 16:40:12'),(368,NULL,'INITIALIZE','Senarai Semak Perolehan','Inisialisasi senarai semak perolehan bagi projek #8 (quotation)','::1','2026-09-17 16:40:53'),(369,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F1-01: Selesai','::1','2026-09-17 16:42:26'),(370,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F1-01: Belum Selesai','::1','2026-09-17 16:42:27'),(371,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F1-01: Belum Selesai','::1','2026-09-17 16:42:30'),(372,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F1-01: Belum Selesai','::1','2026-09-17 16:42:35'),(373,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F8-05: Selesai','::1','2026-09-17 16:44:01'),(374,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F8-05: Belum Selesai','::1','2026-09-17 16:44:05'),(375,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F8-04: Selesai','::1','2026-09-17 16:44:10'),(376,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F8-03: Selesai','::1','2026-09-17 16:44:14'),(377,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F8-03: Selesai','::1','2026-09-17 16:44:38'),(378,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F8-03: Selesai','::1','2026-09-17 16:44:40'),(379,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F8-03: Selesai','::1','2026-09-17 16:44:43'),(380,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F8-03: Selesai','::1','2026-09-17 16:44:53'),(381,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F8-03: Belum Selesai','::1','2026-09-17 16:45:00'),(382,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F8-03: Belum Selesai','::1','2026-09-17 16:45:02'),(383,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F1-02: Selesai','::1','2026-09-17 16:45:21'),(384,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F1-03: Selesai','::1','2026-09-17 16:45:27'),(385,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F1-02: Selesai','::1','2026-09-17 16:45:41'),(386,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F1-02: Selesai','::1','2026-09-17 16:45:44'),(387,NULL,'INITIALIZE','Senarai Semak Perolehan','Inisialisasi senarai semak perolehan bagi projek #7 (tender)','::1','2026-09-17 16:48:07'),(388,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F1-01: Selesai','::1','2026-09-17 16:48:25'),(389,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F1-01: Selesai','::1','2026-09-17 16:50:14'),(390,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F1-01: Selesai','::1','2026-09-17 16:51:20'),(391,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-17 16:51:30'),(392,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F1-01: Selesai','::1','2026-09-17 16:52:20'),(393,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F1-01: Selesai','::1','2026-09-17 16:52:31'),(394,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F1-01: Selesai','::1','2026-09-17 16:52:41'),(395,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F1-01: Belum Selesai','::1','2026-09-17 16:52:52'),(396,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F1-01: Belum Selesai','::1','2026-09-17 16:52:59'),(397,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F1-01: Belum Selesai','::1','2026-09-17 16:55:07'),(398,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F1-01: Belum Selesai','::1','2026-09-17 16:55:27'),(399,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F1-01: Selesai','::1','2026-09-17 16:55:34'),(400,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F1-01: Belum Selesai','::1','2026-09-17 16:55:44'),(401,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F1-01: Belum Selesai','::1','2026-09-17 16:58:44'),(402,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F1-01: Selesai','::1','2026-09-17 16:58:48'),(403,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F1-02: Selesai','::1','2026-09-17 16:58:56'),(404,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F1-02: Belum Selesai','::1','2026-09-17 16:58:59'),(405,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F1-01: Belum Selesai','::1','2026-09-17 16:59:01'),(406,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F1-02: Selesai','::1','2026-09-17 17:04:07'),(407,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F1-02: Belum Selesai','::1','2026-09-17 17:04:25'),(408,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F2-01: Selesai','::1','2026-09-17 17:04:31'),(409,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F2-01: Belum Selesai','::1','2026-09-17 17:04:40'),(410,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F2-02: Selesai','::1','2026-09-17 17:04:45'),(411,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F2-02: Belum Selesai','::1','2026-09-17 17:04:58'),(412,1,'CREATE','Backup','Fail sandaran dicipta: backup_mypmo_2026-09-18_04-55-23.zip (1.02 MB)','::1','2026-09-18 02:55:27'),(413,1,'CREATE','Backup','Fail sandaran dicipta: backup_mypmo_2026-09-18_04-56-32.zip (1.02 MB)','::1','2026-09-18 02:56:33'),(414,NULL,'FAILED_LOGIN','Authentication','Percubaan log masuk gagal untuk emel: nonexistent@example.com','::1','2026-09-18 03:12:51'),(415,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-18 04:01:57'),(416,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F1-02: Belum Selesai','::1','2026-09-18 04:03:39'),(417,1,'UPDATE','Senarai Semak Perolehan','Kemas kini item F1-03: Belum Selesai','::1','2026-09-18 04:03:45'),(418,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-18 10:56:00'),(419,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-18 11:12:08'),(420,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-18 11:13:11'),(421,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-18 11:20:35'),(422,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-19 05:27:54'),(423,1,'TEST_FAILED','Tetapan SMTP','Ujian sambungan SMTP ke smtp.kehakiman.gov.my:587 gagal: A connection attempt failed because the connected party did not properly respond after a period of time, or established connection failed because connected host has failed to respond (10060)','::1','2026-09-19 05:29:31'),(424,1,'UPDATE','Tetapan SMTP','Mengemas kini konfigurasi pelayan SMTP (smtp.kehakiman.gov.my:587, noreply-mypmo@kehakiman.gov.my)','::1','2026-09-19 05:29:47'),(425,1,'UPDATE','Tetapan SMTP','Mengemas kini konfigurasi pelayan SMTP (smtp.kehakiman.gov.my:587, noreply-mypmo@kehakiman.gov.my)','::1','2026-09-19 05:29:51'),(426,1,'UPDATE','Tetapan SMTP','Mengemas kini konfigurasi pelayan SMTP (smtp.kehakiman.gov.my:587, noreply-mypmo@kehakiman.gov.my)','::1','2026-09-19 05:29:53'),(427,1,'UPDATE','Tetapan SMTP','Mengemas kini konfigurasi pelayan SMTP (smtp.kehakiman.gov.my:587, noreply-mypmo@kehakiman.gov.my)','::1','2026-09-19 05:29:55'),(428,1,'UPDATE','Tetapan SMTP','Mengemas kini konfigurasi pelayan SMTP (smtp.kehakiman.gov.my:587, noreply-mypmo@kehakiman.gov.my)','::1','2026-09-19 05:29:59'),(429,1,'UPDATE','Tetapan SMTP','Mengemas kini konfigurasi pelayan SMTP (smtp.kehakiman.gov.my:587, noreply-mypmo@kehakiman.gov.my)','::1','2026-09-19 05:30:06'),(430,1,'UPDATE','Tetapan SMTP','Mengemas kini konfigurasi pelayan SMTP (smtp.kehakiman.gov.my:587, noreply-mypmo@kehakiman.gov.my)','::1','2026-09-19 05:30:13'),(431,1,'UPDATE','Tetapan SMTP','Mengemas kini konfigurasi pelayan SMTP (smtp.kehakiman.gov.my:587, noreply-mypmo@kehakiman.gov.my)','::1','2026-09-19 05:30:19'),(432,1,'UPDATE','Tetapan SMTP','Mengemas kini konfigurasi pelayan SMTP (smtp.kehakiman.gov.my:587, noreply-mypmo@kehakiman.gov.my)','::1','2026-09-19 05:31:19'),(433,1,'UPDATE','Tetapan SMTP','Mengemas kini konfigurasi pelayan SMTP (smtp.kehakiman.gov.my:587, noreply-mypmo@kehakiman.gov.my)','::1','2026-09-19 05:31:25'),(434,1,'UPDATE','Tetapan SMTP','Mengemas kini konfigurasi pelayan SMTP (smtp.kehakiman.gov.my:587, noreply-mypmo@kehakiman.gov.my)','::1','2026-09-19 05:51:25'),(435,1,'UPDATE','Peraturan Amaran','Mengemas kini peraturan amaran automatik (Auto-Alert Rules)','::1','2026-09-19 05:51:50'),(436,1,'UPDATE','Peraturan Amaran','Mengemas kini peraturan amaran automatik (Auto-Alert Rules)','::1','2026-09-19 05:52:32'),(437,1,'UPDATE','Peraturan Amaran','Mengemas kini peraturan amaran automatik (Auto-Alert Rules)','::1','2026-09-19 05:54:17'),(438,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-19 05:54:33'),(439,NULL,'UPDATE','Projects','Projek dikemas kini: ID 8',NULL,'2026-09-19 05:57:27'),(440,1,'UPDATE_SETTINGS','Senarai Semak Perolehan','Kemas kini tetapan senarai semak #2','::1','2026-09-19 06:03:33'),(441,1,'UPDATE_SETTINGS','Senarai Semak Perolehan','Kemas kini tetapan senarai semak #2','::1','2026-09-19 06:04:40'),(442,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-19 06:28:35'),(443,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-19 06:38:36'),(444,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-19 06:38:50'),(445,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-19 06:42:04'),(446,1,'RESET_PASSWORD','Authentication','Pengguna \'Izzat\' telah menetapkan semula kata laluan sendiri melalui e-mel (admin@kehakiman.gov.my)','::1','2026-09-19 06:54:42'),(447,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-19 06:54:42'),(448,1,'RESET_PASSWORD','Authentication','Pengguna \'Izzat\' telah menetapkan semula kata laluan sendiri melalui e-mel (admin@kehakiman.gov.my)','::1','2026-09-19 06:54:42'),(449,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-19 07:02:08'),(450,1,'CREATE','Kalendar','Mencipta acara kalendar: Mesyuarat Jawatankuasa Pemandu ICT Bil. 4/2026 (2026-09-22 10:00)','::1','2026-09-19 07:36:34'),(451,1,'SEND_INVITE','Kalendar','Menghantar jemputan mesyuarat dan fail kalendar Outlook bagi: Mesyuarat Jawatankuasa Pemandu ICT Bil. 4/2026 (1 peserta)','::1','2026-09-19 07:36:37'),(452,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-19 07:55:01'),(453,1,'CREATE','Kalendar','Mencipta acara kalendar: Mesyuarat Jawatankuasa Teknikal eBajet Bil 6/2026 (2026-09-15 10:00) dan jemputan e-mel kalendar dihantar kepada 1 peserta.','::1','2026-09-19 08:07:05'),(454,1,'CREATE','Kalendar','Mencipta acara kalendar: Mesyuarat Jawatankuasa Teknikal ICT Bil. 5/2026 (2026-09-23 14:30)','::1','2026-09-19 08:44:22'),(455,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-19 09:33:25'),(456,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-19 10:00:10'),(457,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-19 12:29:37'),(458,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-19 12:29:44'),(459,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-19 12:30:18'),(460,1,'CREATE','Backup','Fail sandaran dicipta: backup_mypmo_2026-09-19_14-31-15.zip (1.08 MB)','::1','2026-09-19 12:31:31'),(461,1,'CREATE','Finances','Tuntutan baru dicipta: JDL-9730 (RM70,000.00) bagi projek ID: 8','::1','2026-09-19 12:34:49'),(462,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-19 12:36:11'),(463,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-19 12:38:44'),(464,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-19 12:40:54'),(465,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-19 12:42:05'),(466,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-19 14:39:42'),(467,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-19 15:01:29'),(468,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-21 07:12:23'),(469,1,'LOGIN','Authentication','Pengguna berjaya log masuk','::1','2026-09-22 10:33:38');
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backup_logs`
--

DROP TABLE IF EXISTS `backup_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `backup_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) NOT NULL,
  `filepath` varchar(255) NOT NULL,
  `filesize` bigint(20) DEFAULT 0,
  `type` enum('manual','auto') DEFAULT 'manual',
  `frequency_label` varchar(50) DEFAULT 'Manual',
  `created_by` varchar(100) DEFAULT 'Admin',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backup_logs`
--

LOCK TABLES `backup_logs` WRITE;
/*!40000 ALTER TABLE `backup_logs` DISABLE KEYS */;
INSERT INTO `backup_logs` VALUES (1,'backup_mypmo_2026-07-31_09-56-51.zip','backup_mypmo_2026-07-31_09-56-51.zip',804673,'manual','Manual Test','System Test','2026-07-31 07:56:51'),(2,'backup_mypmo_2026-07-31_10-02-01.zip','backup_mypmo_2026-07-31_10-02-01.zip',804801,'manual','Manual','Izzat','2026-07-31 08:02:01'),(3,'backup_mypmo_2026-07-31_10-05-25.zip','backup_mypmo_2026-07-31_10-05-25.zip',804861,'manual','Original Name Test','Admin','2026-07-31 08:05:25'),(4,'backup_mypmo_2026-07-31_10-06-54.zip','backup_mypmo_2026-07-31_10-06-54.zip',805867,'manual','Project Grouping Test','Admin','2026-07-31 08:06:54'),(5,'backup_mypmo_2026-07-31_10-08-28.zip','backup_mypmo_2026-07-31_10-08-28.zip',805895,'manual','Manual','Izzat','2026-07-31 08:08:28'),(6,'backup_mypmo_2026-07-31_10-11-28.zip','backup_mypmo_2026-07-31_10-11-28.zip',1000703,'manual','Complete Backup Test','Admin','2026-07-31 08:11:29'),(7,'backup_mypmo_2026-07-31_10-16-29.zip','backup_mypmo_2026-07-31_10-16-29.zip',1000202,'manual','Folder Rename Test','Admin','2026-07-31 08:16:30'),(8,'backup_mypmo_2026-07-31_10-17-32.zip','backup_mypmo_2026-07-31_10-17-32.zip',999627,'manual','Manual','Izzat','2026-07-31 08:17:35'),(9,'backup_mypmo_2026-08-04_09-03-25.zip','backup_mypmo_2026-08-04_09-03-25.zip',999735,'auto','Auto (Harian)','Sistem Auto-Backup','2026-08-04 07:03:30'),(10,'backup_mypmo_2026-08-10_08-59-43.zip','backup_mypmo_2026-08-10_08-59-43.zip',1005270,'auto','Auto (Harian)','Sistem Auto-Backup','2026-08-10 06:59:47'),(11,'backup_mypmo_2026-08-10_11-32-16.zip','backup_mypmo_2026-08-10_11-32-16.zip',1004995,'manual','Manual','Izzat','2026-08-10 09:32:19'),(12,'backup_mypmo_2026-08-14_12-38-08.zip','backup_mypmo_2026-08-14_12-38-08.zip',1005132,'auto','Auto (Harian)','Sistem Auto-Backup','2026-08-14 10:38:15'),(13,'backup_mypmo_2026-08-17_07-31-56.zip','backup_mypmo_2026-08-17_07-31-56.zip',1005223,'auto','Auto (Harian)','Sistem Auto-Backup','2026-08-17 05:32:02'),(14,'backup_mypmo_2026-08-17_07-32-33.zip','backup_mypmo_2026-08-17_07-32-33.zip',1005241,'manual','Manual','Izzat','2026-08-17 05:32:35'),(15,'backup_mypmo_2026-08-20_06-56-34.zip','backup_mypmo_2026-08-20_06-56-34.zip',1005433,'auto','Auto (Harian)','Sistem Auto-Backup','2026-08-20 04:56:40'),(16,'backup_mypmo_2026-08-20_09-44-25.zip','backup_mypmo_2026-08-20_09-44-25.zip',1011562,'manual','Manual','Izzat','2026-08-20 07:44:27'),(17,'backup_mypmo_2026-08-20_09-44-50.zip','backup_mypmo_2026-08-20_09-44-50.zip',1011615,'manual','Manual','Izzat','2026-08-20 07:44:51'),(18,'backup_mypmo_2026-08-20_09-44-54.zip','backup_mypmo_2026-08-20_09-44-54.zip',1011647,'manual','Manual','Izzat','2026-08-20 07:44:55'),(19,'backup_mypmo_2026-08-20_09-44-57.zip','backup_mypmo_2026-08-20_09-44-57.zip',1011672,'manual','Manual','Izzat','2026-08-20 07:44:59'),(20,'backup_mypmo_2026-08-20_09-45-00.zip','backup_mypmo_2026-08-20_09-45-00.zip',1011704,'manual','Manual','Izzat','2026-08-20 07:45:01'),(21,'backup_mypmo_2026-08-20_09-45-04.zip','backup_mypmo_2026-08-20_09-45-04.zip',1011737,'manual','Manual','Izzat','2026-08-20 07:45:05'),(22,'backup_mypmo_2026-08-20_09-45-07.zip','backup_mypmo_2026-08-20_09-45-07.zip',1011766,'manual','Manual','Izzat','2026-08-20 07:45:09'),(23,'backup_mypmo_2026-08-26_06-05-52.zip','backup_mypmo_2026-08-26_06-05-52.zip',1012151,'auto','Auto (Harian)','Sistem Auto-Backup','2026-08-26 04:05:55'),(24,'backup_mypmo_2026-09-16_14-01-34.zip','backup_mypmo_2026-09-16_14-01-34.zip',1012232,'auto','Auto (Harian)','Sistem Auto-Backup','2026-09-16 12:01:38'),(25,'backup_mypmo_2026-09-18_04-55-23.zip','backup_mypmo_2026-09-18_04-55-23.zip',1072785,'auto','Auto (Harian)','Sistem Auto-Backup','2026-09-18 02:55:27'),(26,'backup_mypmo_2026-09-18_04-56-32.zip','backup_mypmo_2026-09-18_04-56-32.zip',1072808,'manual','Manual','Izzat','2026-09-18 02:56:33'),(27,'backup_mypmo_2026-09-19_14-31-15.zip','backup_mypmo_2026-09-19_14-31-15.zip',1127822,'auto','Auto (Harian)','Sistem Auto-Backup','2026-09-19 12:31:31');
/*!40000 ALTER TABLE `backup_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backup_settings`
--

DROP TABLE IF EXISTS `backup_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `backup_settings` (
  `id` int(11) NOT NULL DEFAULT 1,
  `frequency` enum('off','daily','weekly','monthly','yearly') DEFAULT 'off',
  `scope` enum('both','db','files') DEFAULT 'both',
  `last_backup_at` datetime DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backup_settings`
--

LOCK TABLES `backup_settings` WRITE;
/*!40000 ALTER TABLE `backup_settings` DISABLE KEYS */;
INSERT INTO `backup_settings` VALUES (1,'daily','both','2026-09-19 20:31:31','2026-09-19 12:31:31');
/*!40000 ALTER TABLE `backup_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calendar_events`
--

DROP TABLE IF EXISTS `calendar_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `calendar_events` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `event_date` date NOT NULL,
  `start_time` time DEFAULT '09:00:00',
  `end_time` time DEFAULT '10:00:00',
  `event_type` enum('meeting','milestone','deadline','task','review') DEFAULT 'meeting',
  `location` varchar(255) DEFAULT NULL,
  `meeting_link` varchar(500) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `agenda` text DEFAULT NULL,
  `attendees` text DEFAULT NULL,
  `cc_emails` text DEFAULT NULL,
  `bcc_emails` text DEFAULT NULL,
  `template_id` int(11) DEFAULT NULL,
  `invite_status` enum('draft','sent') DEFAULT 'draft',
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `calendar_events_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `calendar_events_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calendar_events`
--

LOCK TABLES `calendar_events` WRITE;
/*!40000 ALTER TABLE `calendar_events` DISABLE KEYS */;
INSERT INTO `calendar_events` VALUES (3,NULL,'Mesyuarat Jawatankuasa Pemandu ICT Bil. 4/2026','2026-09-22','10:00:00','11:30:00','meeting','Bilik Mesyuarat Utama Aras 4, Istana Kehakiman Putrajaya','https://teams.microsoft.com/l/meetup-join/pmo-kehakiman','Mesyuarat berkala pemantauan projek-projek ICT PKPMP.','1. Perutusan Pengerusi\n2. Pengesahan Minit Mesyuarat Lepas\n3. Pembentangan Status Projek PMO\n4. Hal-hal Lain dan Penutup','[\"admin@kehakiman.gov.my\"]',NULL,NULL,NULL,'sent',1,'2026-09-19 07:36:34'),(4,8,'Mesyuarat Jawatankuasa Teknikal eBajet Bil 6/2026','2026-09-15','10:00:00','11:30:00','meeting','Bilik Mesyuarat BTM','','Mohon ikut peraturan','1. Perutusan Pengerusi\n2. Pengesahan Minit Mesyuarat Bil. Lepas\n3. Pembentangan Kemajuan Projek & Pencapaian Fasa\n4. Perbincangan Isu Teknikal, Risiko & Kewangan\n5. Hal-hal Lain & Tindakan Susulan','[\"izzat@kehakiman.gov.my\"]',NULL,NULL,NULL,'sent',1,'2026-09-19 08:07:03'),(5,NULL,'Mesyuarat Jawatankuasa Teknikal ICT Bil. 5/2026','2026-09-23','14:30:00','16:00:00','meeting','Bilik Mesyuarat Utama, Istana Kehakiman','https://teams.microsoft.com/l/meetup-join/test','','1. Aluan Pengerusi\n2. Pembentangan Senarai Semak','[\"admin@kehakiman.gov.my\"]','[\"cc_officer@kehakiman.gov.my\",\"pmo-group@kehakiman.gov.my\"]','[\"audit_bcc@kehakiman.gov.my\"]',1,'sent',1,'2026-09-19 08:44:14');
/*!40000 ALTER TABLE `calendar_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `divisions`
--

DROP TABLE IF EXISTS `divisions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `divisions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `divisions`
--

LOCK TABLES `divisions` WRITE;
/*!40000 ALTER TABLE `divisions` DISABLE KEYS */;
INSERT INTO `divisions` VALUES (1,'BTM','Bahagian Teknologi Maklumat (BTM)','Pengurusan sistem maklumat & infrastruktur IT PKPMP','2026-07-24 10:50:12','2026-07-24 10:50:12'),(2,'BPMP','Bahagian Pendaftaran Mahkamah Persekutuan (BPMP)','Pengurusan pendaftaran kes & pentadbiran Mahkamah Persekutuan','2026-07-24 10:50:12','2026-07-24 10:50:12'),(3,'BKW','Bahagian Kewangan & Akaun (BKW)','Pengurusan belanjawan, kewangan & akaun PKPMP','2026-07-24 10:50:12','2026-07-24 10:50:12'),(4,'PUU','Pejabat Penasihat Undang-Undang (PUU)','Khidmat nasihat undang-undang & perundangan kehakiman','2026-07-24 10:50:12','2026-07-24 10:50:12'),(5,'BPSM','Bahagian Sumber Manusia (BPSM)','Pengurusan sumber manusia, perkhidmatan & perjawatan','2026-07-24 10:50:12','2026-07-24 10:50:12'),(6,'BPP','Bahagian Latihan & Penyelidikan (BPP)','Penyelidikan undang-undang & latihan pegawai kehakiman','2026-07-24 10:50:12','2026-07-24 10:50:12'),(7,'BPMTSS','Pendaftaran Mahkamah Tinggi S&S','Pendaftaran Mahkamah Tinggi Sabah & Sarawak','2026-07-24 10:50:12','2026-07-24 10:50:12');
/*!40000 ALTER TABLE `divisions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documents`
--

DROP TABLE IF EXISTS `documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `documents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `uploader_id` int(11) NOT NULL,
  `file_size` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `uploader_id` (`uploader_id`),
  CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `documents_ibfk_2` FOREIGN KEY (`uploader_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documents`
--

LOCK TABLES `documents` WRITE;
/*!40000 ALTER TABLE `documents` DISABLE KEYS */;
INSERT INTO `documents` VALUES (1,3,'Minis Mesyuarat Kickoff.docx','doc_6a62d84e98b5e9.40514181.docx','Minit Mesyuarat',1,196007,'2026-07-24 03:13:18'),(2,7,'Minis Mesyuarat Kickoff.docx','doc_6a66d18dcc0435.10652340.docx','Minit Mesyuarat',1,196007,'2026-07-27 03:33:33'),(3,7,'Invoice Payment.docx','doc_6a66d1c46f0290.73377763.docx','Kewangan & Bajet',1,195848,'2026-07-27 03:34:28'),(4,7,'Invoice Payment 2.docx','doc_6a66d1fc2b6bd4.90575926.docx','Kewangan & Bajet',1,195848,'2026-07-27 03:35:24'),(5,7,'Kontrak Legal.docx','doc_6a66d24ba63153.25568533.docx','Dokumen Kontrak',1,8315,'2026-07-27 03:36:43'),(13,7,'01_Work_Order_WO-ATP-2026-014.txt','doc_6a670e644bcea1.83360867.txt','Kanban File',1,62,'2026-07-27 07:53:08'),(14,7,'02_Email_Vendor_Acknowledgement_and_Access_Request.txt','doc_6a670e6452ce62.55310901.txt','Kanban File',1,83,'2026-07-27 07:53:08'),(15,7,'00_README_Tugasan_Modul11.txt','doc_6a6714d6b86215.52423004.txt','Kanban File',1,58,'2026-07-27 08:20:38'),(18,7,'Butiran_Denda_DND-2026-164.xlsx','doc_6a729246bfad70.35037558.xlsx','Denda',1,11680,'2026-08-05 01:30:46');
/*!40000 ALTER TABLE `documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `email_templates`
--

DROP TABLE IF EXISTS `email_templates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `email_templates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `category` varchar(50) DEFAULT 'meeting',
  `subject` varchar(255) NOT NULL,
  `body` text NOT NULL,
  `is_default` tinyint(1) DEFAULT 0,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `email_templates`
--

LOCK TABLES `email_templates` WRITE;
/*!40000 ALTER TABLE `email_templates` DISABLE KEYS */;
INSERT INTO `email_templates` VALUES (1,'Jemputan Mesyuarat Pemandu ICT (Piawai PKPMP)','meeting','Jemputan Rasmi: {TAJUK_MESYUARAT} ({TARIKH})','Assalamualaikum dan Salam Sejahtera YBhg. Datuk / Dato\' / Datin / Tuan / Puan,\n\nDengan segala hormatnya dimaklumkan bahawa mesyuarat berikut akan diadakan seperti butiran di bawah:\n\nTarikh: {TARIKH}\nMasa: {MASA}\nLokasi: {LOKASI}\nProjek: {PROJEK}\n\nAGENDA MESYUARAT:\n{AGENDA}\n\nPautan Maya: {PAUTAN_MEETING}\n\nKehadiran dan kerjasama pihak YBhg. Datuk / Dato\' / Datin / Tuan / Puan amatlah dihargai.\n\nSekian, terima kasih.\n\nUrusetia PMO PKPMP',1,NULL,'2026-09-19 08:17:12','2026-09-19 08:17:12'),(2,'Sesi Semakan Projek & Audit Teknikal','review','Notis Sesi Semakan Kemajuan: {TAJUK_MESYUARAT}','Salam Sejahtera,\n\nDimaklumkan bahawa sesi semakan kemajuan dan status fasa projek {PROJEK} akan dilaksanakan pada {TARIKH} jam {MASA}.\n\nLokasi: {LOKASI}\n\nAGENDA SEMAKAN:\n{AGENDA}\n\nMohon pihak vendor dan pegawai projek menyediakan dokumen sokongan berkaitan sebelum sesi bermula.\n\nUrusetia PMO PKPMP',0,NULL,'2026-09-19 08:17:12','2026-09-19 08:17:12'),(3,'Mesyuarat Penyelarasan Vendor PMO','meeting','Mesyuarat Penyelarasan Vendor PMO: {TAJUK_MESYUARAT}','Tuan/Puan,\n\nSatu mesyuarat penyelarasan teknikal bersama pihak vendor perolehan ICT PKPMP akan diadakan seperti ketetapan berikut:\n\nTarikh: {TARIKH}\nMasa: {MASA}\nLokasi/Pautan: {LOKASI}\n\nAGENDA:\n{AGENDA}\n\nKehadiran adalah diwajibkan.\n\nUrusetia PMO PKPMP',0,NULL,'2026-09-19 08:17:12','2026-09-19 08:17:12');
/*!40000 ALTER TABLE `email_templates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `finances`
--

DROP TABLE IF EXISTS `finances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `finances` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `invoice_no` varchar(50) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `vendor` varchar(150) DEFAULT NULL,
  `amount` decimal(15,2) NOT NULL,
  `status` varchar(50) DEFAULT 'Menunggu',
  `date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `type` varchar(50) DEFAULT 'Invois',
  `milestone_id` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `finances_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `finances`
--

LOCK TABLES `finances` WRITE;
/*!40000 ALTER TABLE `finances` DISABLE KEYS */;
INSERT INTO `finances` VALUES (1,3,'INV-2026-317','Bayaran 3','IBS Sdn Bhd',20000.00,'Selesai','2026-07-24','2026-07-24 03:07:43','Invois',NULL),(2,7,'INV-2026-588','Bayaran 1','Pine Supplies Sdn. Bhd',340000.00,'Selesai','2026-07-27','2026-07-27 03:00:55','Invois',NULL),(3,7,'INV-2026-364','Bayaran 2','Pine Supplies Sdn. Bhd',120000.00,'Selesai','2026-07-28','2026-07-27 03:07:49','Invois',NULL),(4,7,'INV-2026-885','Bayaran 3','Pine Supplies Sdn. Bhd',20000.00,'Selesai','2026-07-29','2026-07-27 03:09:06','Invois',NULL),(5,7,'DND-2026-164','[DENDA SLA: Kelewatan Masa (Delay)] Lewat UAT (0.5 X 20)','Pine Supplies Sdn. Bhd',3000.00,'','2026-08-05','2026-08-05 01:30:46','Denda',NULL),(6,7,'INV-2026-510','Tuntutan Fasa 3: Audit Keselamatan & Integrasi','Pine Supplies Sdn. Bhd',250000.00,'Selesai','2026-09-17','2026-09-16 17:07:56','Invois',NULL),(7,8,'INV-2026-131','Tuntutan bayaran fasa 1','Goo Inc',60000.00,'Selesai','2026-09-24','2026-09-16 18:20:36','Invois','2147483647'),(8,8,'INV-2026-304','Tuntutan bayaran fasa 2','Goo Inc',70000.00,'Menunggu Kelulusan','2026-09-18','2026-09-16 18:34:27','Invois','2147483647'),(9,8,'JDL-6705','fasa 3','Goo Inc',50000.00,'Menunggu','2026-10-28','2026-09-16 18:48:26','Invois','2147483647'),(10,8,'JDL-9730','Bayaran 1','Goo Inc',70000.00,'Menunggu','2026-09-30','2026-09-19 12:34:49','Invois','1789821289730');
/*!40000 ALTER TABLE `finances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gantt_tasks`
--

DROP TABLE IF EXISTS `gantt_tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gantt_tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `planned_start` date NOT NULL,
  `planned_end` date NOT NULL,
  `actual_start` date DEFAULT NULL,
  `actual_end` date DEFAULT NULL,
  `progress` int(11) DEFAULT 0,
  `status` enum('Belum Mula','Sedang Berjalan','Selesai','Tertunda') DEFAULT 'Belum Mula',
  `is_milestone` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `gantt_tasks_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gantt_tasks`
--

LOCK TABLES `gantt_tasks` WRITE;
/*!40000 ALTER TABLE `gantt_tasks` DISABLE KEYS */;
INSERT INTO `gantt_tasks` VALUES (8,3,'Pencapaian 1: Kelulusan SRS & Senibina Sistem','2026-09-24','2026-09-24','2026-09-24','2026-09-24',100,'Selesai',1,'2026-07-24 03:51:33'),(9,3,'Fasa 2: Pembangunan Infrastruktur & Pangkalan Data','2026-10-24','2026-12-24','2026-10-24','2026-12-24',100,'Selesai',0,'2026-07-24 03:51:33'),(10,3,'Fasa 3: Pembangunan Modul & Pengujian UAT','2027-01-24','2027-03-24','2027-01-24','2027-03-09',65,'Sedang Berjalan',0,'2026-07-24 03:51:33'),(11,3,'Pencapaian 2: Sijil Kelulusan Audit Keselamatan & UAT','2027-03-24','2027-03-24',NULL,NULL,50,'Sedang Berjalan',1,'2026-07-24 03:51:33'),(12,3,'Fasa 4: Latihan Pengguna & Pelancaran Go-Live','2027-04-24','2028-10-24',NULL,NULL,0,'Belum Mula',0,'2026-07-24 03:51:33'),(13,4,'Fasa 1: Pengumpulan Keperluan & Reka Bentuk','2026-08-03','2026-09-03','2026-08-03','2026-10-03',100,'Selesai',0,'2026-07-24 04:08:37'),(14,4,'Pencapaian 1: Kelulusan SRS & Senibina Sistem','2026-10-03','2026-10-03','2026-10-03','2026-10-03',100,'Selesai',1,'2026-07-24 04:08:37'),(15,4,'Fasa 2: Pembangunan Infrastruktur & Pangkalan Data','2026-11-03','2027-01-03','2026-11-03','2027-01-03',100,'Selesai',0,'2026-07-24 04:08:37'),(16,4,'Fasa 3: Pembangunan Modul & Pengujian UAT','2027-02-03','2027-04-03','2027-02-03','2027-03-19',65,'Sedang Berjalan',0,'2026-07-24 04:08:37'),(17,4,'Pencapaian 2: Sijil Kelulusan Audit Keselamatan & UAT','2027-04-03','2027-04-03',NULL,NULL,50,'Sedang Berjalan',1,'2026-07-24 04:08:37'),(18,4,'Fasa 4: Latihan Pengguna & Pelancaran Go-Live','2027-05-03','2028-08-03',NULL,NULL,0,'Belum Mula',0,'2026-07-24 04:08:37'),(19,7,'Fasa 1: Pengumpulan Keperluan & Reka Bentuk','2026-07-20','2026-09-20','2026-07-22','2026-09-25',100,'Selesai',1,'2026-07-24 09:16:47'),(20,7,'Pencapaian 1: Kelulusan SRS & Senibina Sistem','2026-09-20','2026-09-20','2026-09-20','2026-09-20',100,'Selesai',0,'2026-07-24 09:16:47'),(21,7,'Fasa 2: Pembangunan Infrastruktur & Pangkalan Data','2026-10-20','2026-12-20','2026-10-20','2026-12-20',100,'Selesai',0,'2026-07-24 09:16:47'),(22,7,'Fasa 3: Pembangunan Modul & Pengujian UAT','2027-01-20','2027-03-20','2027-01-20','2027-03-05',80,'Sedang Berjalan',0,'2026-07-24 09:16:47'),(23,7,'Pencapaian 2: Sijil Kelulusan Audit Keselamatan & UAT','2027-03-20','2027-03-20',NULL,NULL,50,'Sedang Berjalan',1,'2026-07-24 09:16:47'),(24,7,'Fasa 4: Latihan Pengguna & Pelancaran Go-Live','2027-04-20','2026-07-24',NULL,NULL,0,'Belum Mula',0,'2026-07-24 09:16:47'),(25,6,'Fasa 1: Pengumpulan Keperluan & Reka Bentuk','2026-07-20','2026-09-20','2026-07-20','2026-09-20',100,'Selesai',0,'2026-07-30 02:20:20'),(26,6,'Pencapaian 1: Kelulusan SRS & Senibina Sistem','2026-09-20','2026-09-20','2026-09-20','2026-09-20',100,'Selesai',1,'2026-07-30 02:20:20'),(27,6,'Fasa 2: Pembangunan Infrastruktur & Pangkalan Data','2026-10-20','2026-12-20','2026-10-20','2026-12-20',100,'Selesai',0,'2026-07-30 02:20:20'),(28,6,'Fasa 3: Pembangunan Modul & Pengujian UAT','2027-01-20','2027-03-20','2027-01-20','2027-03-05',65,'Sedang Berjalan',0,'2026-07-30 02:20:20'),(29,6,'Pencapaian 2: Sijil Kelulusan Audit Keselamatan & UAT','2027-03-20','2027-03-20',NULL,NULL,50,'Sedang Berjalan',1,'2026-07-30 02:20:20'),(30,6,'Fasa 4: Latihan Pengguna & Pelancaran Go-Live','2027-04-20','2028-07-24',NULL,NULL,0,'Belum Mula',0,'2026-07-30 02:20:20'),(31,5,'Fasa 1: Pengumpulan Keperluan & Reka Bentuk','2025-08-12','2025-10-12','2025-08-12','2025-10-12',100,'Selesai',0,'2026-07-30 02:21:14'),(32,5,'Pencapaian 1: Kelulusan SRS & Senibina Sistem','2025-10-12','2025-10-12','2025-10-12','2025-10-12',100,'Selesai',1,'2026-07-30 02:21:14'),(33,5,'Fasa 2: Pembangunan Infrastruktur & Pangkalan Data','2025-11-12','2026-01-12','2025-11-12','2026-01-12',100,'Selesai',0,'2026-07-30 02:21:14'),(34,5,'Fasa 3: Pembangunan Modul & Pengujian UAT','2026-02-12','2026-04-12','2026-02-12','2026-03-28',65,'Sedang Berjalan',0,'2026-07-30 02:21:14'),(35,5,'Pencapaian 2: Sijil Kelulusan Audit Keselamatan & UAT','2026-04-12','2026-04-12',NULL,NULL,50,'Sedang Berjalan',1,'2026-07-30 02:21:14'),(36,5,'Fasa 4: Latihan Pengguna & Pelancaran Go-Live','2026-05-12','2026-02-22',NULL,NULL,0,'Belum Mula',0,'2026-07-30 02:21:14'),(43,8,'fasa1','2026-09-17','2026-09-29','2026-09-17','2026-10-08',0,'Sedang Berjalan',0,'2026-09-16 18:18:51');
/*!40000 ALTER TABLE `gantt_tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `project_id` int(11) DEFAULT NULL,
  `type` enum('danger','warning','info','success') DEFAULT 'info',
  `category` varchar(50) NOT NULL,
  `title` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `link_view` varchar(100) DEFAULT 'dashboard',
  `is_read` tinyint(1) DEFAULT 0,
  `email_sent` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `procurement_checklist_items`
--

DROP TABLE IF EXISTS `procurement_checklist_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `procurement_checklist_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `checklist_id` int(11) NOT NULL,
  `phase_number` int(11) NOT NULL,
  `phase_name` varchar(150) NOT NULL,
  `item_code` varchar(50) NOT NULL,
  `item_title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `is_mandatory` tinyint(1) DEFAULT 1,
  `is_checked` tinyint(1) DEFAULT 0,
  `checked_by` varchar(100) DEFAULT NULL,
  `checked_at` datetime DEFAULT NULL,
  `document_id` int(11) DEFAULT NULL COMMENT 'Pautan ke fail documents.id (DMS)',
  `reference_no` varchar(100) DEFAULT NULL COMMENT 'No. Rujukan Surat / Minit / Kelulusan',
  `status` enum('pending','submitted','verified','not_applicable') DEFAULT 'pending',
  `remarks` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_checklist_items_parent` (`checklist_id`),
  KEY `fk_checklist_item_doc` (`document_id`),
  CONSTRAINT `fk_checklist_item_doc` FOREIGN KEY (`document_id`) REFERENCES `documents` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_checklist_items_parent` FOREIGN KEY (`checklist_id`) REFERENCES `procurement_checklists` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `procurement_checklist_items`
--

LOCK TABLES `procurement_checklist_items` WRITE;
/*!40000 ALTER TABLE `procurement_checklist_items` DISABLE KEYS */;
INSERT INTO `procurement_checklist_items` VALUES (1,1,1,'Kelulusan Teknikal (JPICT)','F1-01','Kertas Cadangan JPICT','Dokumen kertas cadangan perolehan ICT lengkap mengikut format standard JPICT PKPMP.',1,0,NULL,NULL,NULL,'PKPMP/BTM/ICT/01/2026','pending','Draf belum selesai','2026-09-17 23:57:48','2026-09-18 00:55:44'),(2,1,1,'Kelulusan Teknikal (JPICT)','F1-02','Slaid Pembentangan JPICT','Bahan slaid pembentangan mesyuarat jawatankuasa teknikal ICT.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-17 23:57:48','2026-09-17 23:57:48'),(3,1,1,'Kelulusan Teknikal (JPICT)','F1-03','Surat / Minit Kelulusan JPICT','Salinan surat atau cabutan minit mesyuarat yang mengesahkan kelulusan perolehan.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-17 23:57:48','2026-09-17 23:57:48'),(4,1,2,'Permohonan Lampiran J','F2-01','Borang Format Kod Objek Sebagai','Borang permohonan pengesahan kod Objek Sebagai bagi pecahan peruntukan ICT.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-17 23:57:48','2026-09-17 23:57:48'),(5,1,2,'Permohonan Lampiran J','F2-02','Salinan Kelulusan JPICT Disahkan','Salinan sokongan kelulusan JPICT yang disahkan pegawai penyelaras.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-17 23:57:48','2026-09-17 23:57:48'),(6,1,3,'Permohonan Kelulusan Belanja','F3-01','Memo Iringan Kelulusan Belanja','Memo rasmi kepada Bahagian Kewangan / Pegawai Pengawal bagi kelulusan perbelanjaan.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-17 23:57:48','2026-09-17 23:57:48'),(7,1,3,'Permohonan Kelulusan Belanja','F3-02','Kertas Belanja Terperinci','Justifikasi dan pecahan kos terperinci perbelanjaan yang dipohon.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-17 23:57:48','2026-09-17 23:57:48'),(8,1,3,'Permohonan Kelulusan Belanja','F3-03','Salinan Lampiran J Disahkan','Pengesahan Lampiran J daripada Bahagian Kewangan.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-17 23:57:48','2026-09-17 23:57:48'),(9,1,4,'Permohonan ezApply (Aset Tak Ketara / Harta Modal)','F4-01','Memo Permohonan ezApply','Memo rasmi permohonan peruntukan ezApply bagi Harta Modal atau Lesen Perisian (Aset Tak Ketara).',0,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-17 23:57:48','2026-09-17 23:57:48'),(10,1,4,'Permohonan ezApply (Aset Tak Ketara / Harta Modal)','F4-02','Kertas Belanja & Lampiran J Sokongan','Dokumen salinan kelulusan belanja dan Lampiran J.',0,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-17 23:57:48','2026-09-17 23:57:48'),(11,1,4,'Permohonan ezApply (Aset Tak Ketara / Harta Modal)','F4-03','3 Sebutharga Pasaran (Kajian Pasaran)','Tiga (3) salinan sebut harga pasaran daripada pembekal berdaftar bagi perbandingan nilai.',0,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-17 23:57:48','2026-09-17 23:57:48'),(12,1,5,'Permohonan Tapak ePerolehan (eP)','F5-01','Memo Iringan Permohonan Tapak eP','Memo kepada Unit Perolehan PKPMP untuk pembukaan tapak sistem ePerolehan.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-17 23:57:48','2026-09-17 23:57:48'),(13,1,5,'Permohonan Tapak ePerolehan (eP)','F5-02','Salinan Kelulusan Belanja','Surat / Memo kelulusan peruntukan belanja yang telah diluluskan.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-17 23:57:48','2026-09-17 23:57:48'),(14,1,5,'Permohonan Tapak ePerolehan (eP)','F5-03','Borang Senarai Semak Lampiran 2','Senarai semak permohonan tapak ePerolehan mengikut format Unit Perolehan PKPMP.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-17 23:57:48','2026-09-17 23:57:48'),(15,1,5,'Permohonan Tapak ePerolehan (eP)','F5-04','Anggaran Jabatan (Departmental Estimate)','Anggaran harga siling jabatan yang dimeterai dan disimpan dalam kerahsiaan.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-17 23:57:48','2026-09-17 23:57:48'),(16,1,6,'Pelantikan Jawatankuasa Perolehan','F6-01','Surat Lantikan Jawatankuasa Spesifikasi','Surat lantikan rasmi ahli JK Penyedia Spesifikasi Teknikal.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-17 23:57:48','2026-09-17 23:57:48'),(17,1,6,'Pelantikan Jawatankuasa Perolehan','F6-02','Surat Lantikan Jawatankuasa Pembuka','Surat lantikan pegawai pembuka dokumen tawaran sebutharga/tender.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-17 23:57:48','2026-09-17 23:57:48'),(18,1,6,'Pelantikan Jawatankuasa Perolehan','F6-03','Surat Lantikan Jawatankuasa Penilai Teknikal & Kewangan','Surat lantikan JK Penilaian Teknikal dan JK Penilaian Kewangan.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-17 23:57:48','2026-09-17 23:57:48'),(19,1,7,'Penyediaan Dokumen Pelawaan','F7-01','Dokumen Sebutharga / Tender Lengkap','Draf dokumen pelawaan lengkap yang disahkan oleh JK Spesifikasi.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-17 23:57:48','2026-09-17 23:57:48'),(20,1,7,'Penyediaan Dokumen Pelawaan','F7-02','Jadual Pematuhan Spesifikasi Teknikal','Format matriks pematuhan teknikal (Compliance Matrix) untuk diisi oleh petender/pembekal.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-17 23:57:48','2026-09-17 23:57:48'),(21,1,7,'Penyediaan Dokumen Pelawaan','F7-03','Jadual Harga & Pecahan Kos Pembekal','Format tawaran harga dan senarai kuantiti (Bill of Quantities).',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-17 23:57:48','2026-09-17 23:57:48'),(22,1,8,'Perakuan, Keputusan & Surat Setuju Terima (SST)','F8-01','Kertas Perakuan Pelantikan Pembekal','Kertas pertimbangan perakuan untuk diangkat kepada Lembaga Perolehan (LP).',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-17 23:57:48','2026-09-17 23:57:48'),(23,1,8,'Perakuan, Keputusan & Surat Setuju Terima (SST)','F8-02','Laporan Penilaian Teknikal & Kewangan','Laporan penuh penilaian perolehan yang ditandatangani oleh semua ahli jawatankuasa penilai.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-17 23:57:48','2026-09-17 23:57:48'),(24,1,8,'Perakuan, Keputusan & Surat Setuju Terima (SST)','F8-03','Minit / Keputusan Kelulusan Lembaga Perolehan (LP)','Cabutan keputusan rasmi kelulusan pelantikan pembekal berjaya oleh Lembaga Perolehan (LP).',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-17 23:57:48','2026-09-17 23:57:48'),(25,1,8,'Perakuan, Keputusan & Surat Setuju Terima (SST)','F8-04','Surat Setuju Terima (SST) Bertandatangan','Salinan Surat Setuju Terima (SST) yang telah ditandatangani dan diakui penerimaan oleh pembekal berjaya.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-17 23:57:48','2026-09-17 23:57:48'),(26,1,8,'Perakuan, Keputusan & Surat Setuju Terima (SST)','F8-05','Bon Pelaksanaan & Dokumen Perjanjian Kontrak','Jaminan Bank / Bon Pelaksanaan dan Dokumen Kontrak Rasmi Kerajaan (Wajib jika tempoh pelaksanaan melebihi 4 bulan).',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-17 23:57:48','2026-09-17 23:57:48'),(27,2,1,'Kelulusan Teknikal (JPICT)','F1-01','Kertas Cadangan JPICT','Dokumen kertas cadangan perolehan ICT lengkap mengikut format standard JPICT PKPMP.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:40:53','2026-09-18 00:42:35'),(28,2,1,'Kelulusan Teknikal (JPICT)','F1-02','Slaid Pembentangan JPICT','Bahan slaid pembentangan mesyuarat jawatankuasa teknikal ICT.',1,0,NULL,NULL,NULL,'','pending','','2026-09-18 00:40:53','2026-09-18 12:03:39'),(29,2,1,'Kelulusan Teknikal (JPICT)','F1-03','Surat / Minit Kelulusan JPICT','Salinan surat atau cabutan minit mesyuarat yang mengesahkan kelulusan perolehan.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:40:53','2026-09-18 12:03:45'),(30,2,2,'Permohonan Lampiran J','F2-01','Borang Format Kod Objek Sebagai','Borang permohonan pengesahan kod Objek Sebagai bagi pecahan peruntukan ICT.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:40:53','2026-09-18 00:40:53'),(31,2,2,'Permohonan Lampiran J','F2-02','Salinan Kelulusan JPICT Disahkan','Salinan sokongan kelulusan JPICT yang disahkan pegawai penyelaras.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:40:53','2026-09-18 00:40:53'),(32,2,3,'Permohonan Kelulusan Belanja','F3-01','Memo Iringan Kelulusan Belanja','Memo rasmi kepada Bahagian Kewangan / Pegawai Pengawal bagi kelulusan perbelanjaan.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:40:53','2026-09-18 00:40:53'),(33,2,3,'Permohonan Kelulusan Belanja','F3-02','Kertas Belanja Terperinci','Justifikasi dan pecahan kos terperinci perbelanjaan yang dipohon.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:40:53','2026-09-18 00:40:53'),(34,2,3,'Permohonan Kelulusan Belanja','F3-03','Salinan Lampiran J Disahkan','Pengesahan Lampiran J daripada Bahagian Kewangan.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:40:53','2026-09-18 00:40:53'),(35,2,4,'Permohonan ezApply (Aset Tak Ketara / Harta Modal)','F4-01','Memo Permohonan ezApply','Memo rasmi permohonan peruntukan ezApply bagi Harta Modal atau Lesen Perisian (Aset Tak Ketara).',0,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:40:53','2026-09-18 00:40:53'),(36,2,4,'Permohonan ezApply (Aset Tak Ketara / Harta Modal)','F4-02','Kertas Belanja & Lampiran J Sokongan','Dokumen salinan kelulusan belanja dan Lampiran J.',0,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:40:53','2026-09-18 00:40:53'),(37,2,4,'Permohonan ezApply (Aset Tak Ketara / Harta Modal)','F4-03','3 Sebutharga Pasaran (Kajian Pasaran)','Tiga (3) salinan sebut harga pasaran daripada pembekal berdaftar bagi perbandingan nilai.',0,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:40:53','2026-09-18 00:40:53'),(38,2,5,'Permohonan Tapak ePerolehan (eP)','F5-01','Memo Iringan Permohonan Tapak eP','Memo kepada Unit Perolehan PKPMP untuk pembukaan tapak sistem ePerolehan.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:40:53','2026-09-18 00:40:53'),(39,2,5,'Permohonan Tapak ePerolehan (eP)','F5-02','Salinan Kelulusan Belanja','Surat / Memo kelulusan peruntukan belanja yang telah diluluskan.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:40:53','2026-09-18 00:40:53'),(40,2,5,'Permohonan Tapak ePerolehan (eP)','F5-03','Borang Senarai Semak Lampiran 2','Senarai semak permohonan tapak ePerolehan mengikut format Unit Perolehan PKPMP.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:40:53','2026-09-18 00:40:53'),(41,2,5,'Permohonan Tapak ePerolehan (eP)','F5-04','Anggaran Jabatan (Departmental Estimate)','Anggaran harga siling jabatan yang dimeterai dan disimpan dalam kerahsiaan.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:40:53','2026-09-18 00:40:53'),(42,2,6,'Pelantikan Jawatankuasa Perolehan','F6-01','Surat Lantikan Jawatankuasa Spesifikasi','Surat lantikan rasmi ahli JK Penyedia Spesifikasi Teknikal.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:40:53','2026-09-18 00:40:53'),(43,2,6,'Pelantikan Jawatankuasa Perolehan','F6-02','Surat Lantikan Jawatankuasa Pembuka','Surat lantikan pegawai pembuka dokumen tawaran sebutharga/tender.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:40:53','2026-09-18 00:40:53'),(44,2,6,'Pelantikan Jawatankuasa Perolehan','F6-03','Surat Lantikan Jawatankuasa Penilai Teknikal & Kewangan','Surat lantikan JK Penilaian Teknikal dan JK Penilaian Kewangan.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:40:53','2026-09-18 00:40:53'),(45,2,7,'Penyediaan Dokumen Pelawaan','F7-01','Dokumen Sebutharga / Tender Lengkap','Draf dokumen pelawaan lengkap yang disahkan oleh JK Spesifikasi.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:40:53','2026-09-18 00:40:53'),(46,2,7,'Penyediaan Dokumen Pelawaan','F7-02','Jadual Pematuhan Spesifikasi Teknikal','Format matriks pematuhan teknikal (Compliance Matrix) untuk diisi oleh petender/pembekal.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:40:53','2026-09-18 00:40:53'),(47,2,7,'Penyediaan Dokumen Pelawaan','F7-03','Jadual Harga & Pecahan Kos Pembekal','Format tawaran harga dan senarai kuantiti (Bill of Quantities).',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:40:53','2026-09-18 00:40:53'),(48,2,8,'Perakuan, Keputusan & Surat Setuju Terima (SST)','F8-01','Kertas Perakuan Pelantikan Pembekal','Kertas pertimbangan perakuan untuk diangkat kepada Jawatankuasa Sebutharga (JKSH).',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:40:53','2026-09-18 00:40:53'),(49,2,8,'Perakuan, Keputusan & Surat Setuju Terima (SST)','F8-02','Laporan Penilaian Teknikal & Kewangan','Laporan penuh penilaian perolehan yang ditandatangani oleh semua ahli jawatankuasa penilai.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:40:53','2026-09-18 00:40:53'),(50,2,8,'Perakuan, Keputusan & Surat Setuju Terima (SST)','F8-03','Minit / Keputusan Kelulusan Jawatankuasa Sebutharga (JKSH)','Cabutan keputusan rasmi kelulusan pelantikan pembekal berjaya oleh Jawatankuasa Sebutharga (JKSH).',1,0,NULL,NULL,NULL,'','pending','','2026-09-18 00:40:53','2026-09-18 00:45:02'),(51,2,8,'Perakuan, Keputusan & Surat Setuju Terima (SST)','F8-04','Surat Setuju Terima (SST) Bertandatangan','Salinan Surat Setuju Terima (SST) yang telah ditandatangani dan diakui penerimaan oleh pembekal berjaya.',1,1,'Izzat','2026-09-17 18:44:10',NULL,NULL,'verified',NULL,'2026-09-18 00:40:53','2026-09-18 00:44:10'),(52,2,8,'Perakuan, Keputusan & Surat Setuju Terima (SST)','F8-05','Bon Pelaksanaan & Dokumen Perjanjian Kontrak','Jaminan Bank / Bon Pelaksanaan dan Dokumen Kontrak Rasmi Kerajaan (Wajib jika tempoh pelaksanaan melebihi 4 bulan).',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:40:53','2026-09-18 00:44:05'),(53,3,1,'Kelulusan Teknikal (JPICT)','F1-01','Kertas Cadangan JPICT','Dokumen kertas cadangan perolehan ICT lengkap mengikut format standard JPICT PKPMP.',1,0,NULL,NULL,NULL,'','pending','','2026-09-18 00:48:06','2026-09-18 00:59:01'),(54,3,1,'Kelulusan Teknikal (JPICT)','F1-02','Slaid Pembentangan JPICT','Bahan slaid pembentangan mesyuarat jawatankuasa teknikal ICT.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:48:06','2026-09-18 01:04:25'),(55,3,1,'Kelulusan Teknikal (JPICT)','F1-03','Surat / Minit Kelulusan JPICT','Salinan surat atau cabutan minit mesyuarat yang mengesahkan kelulusan perolehan.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:48:06','2026-09-18 00:48:06'),(56,3,2,'Permohonan Lampiran J','F2-01','Borang Format Kod Objek Sebagai','Borang permohonan pengesahan kod Objek Sebagai bagi pecahan peruntukan ICT.',1,0,NULL,NULL,NULL,'','pending','','2026-09-18 00:48:07','2026-09-18 01:04:40'),(57,3,2,'Permohonan Lampiran J','F2-02','Salinan Kelulusan JPICT Disahkan','Salinan sokongan kelulusan JPICT yang disahkan pegawai penyelaras.',1,0,NULL,NULL,NULL,'','pending','','2026-09-18 00:48:07','2026-09-18 01:04:58'),(58,3,3,'Permohonan Kelulusan Belanja','F3-01','Memo Iringan Kelulusan Belanja','Memo rasmi kepada Bahagian Kewangan / Pegawai Pengawal bagi kelulusan perbelanjaan.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:48:07','2026-09-18 00:48:07'),(59,3,3,'Permohonan Kelulusan Belanja','F3-02','Kertas Belanja Terperinci','Justifikasi dan pecahan kos terperinci perbelanjaan yang dipohon.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:48:07','2026-09-18 00:48:07'),(60,3,3,'Permohonan Kelulusan Belanja','F3-03','Salinan Lampiran J Disahkan','Pengesahan Lampiran J daripada Bahagian Kewangan.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:48:07','2026-09-18 00:48:07'),(61,3,4,'Permohonan ezApply (Aset Tak Ketara / Harta Modal)','F4-01','Memo Permohonan ezApply','Memo rasmi permohonan peruntukan ezApply bagi Harta Modal atau Lesen Perisian (Aset Tak Ketara).',0,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:48:07','2026-09-18 00:48:07'),(62,3,4,'Permohonan ezApply (Aset Tak Ketara / Harta Modal)','F4-02','Kertas Belanja & Lampiran J Sokongan','Dokumen salinan kelulusan belanja dan Lampiran J.',0,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:48:07','2026-09-18 00:48:07'),(63,3,4,'Permohonan ezApply (Aset Tak Ketara / Harta Modal)','F4-03','3 Sebutharga Pasaran (Kajian Pasaran)','Tiga (3) salinan sebut harga pasaran daripada pembekal berdaftar bagi perbandingan nilai.',0,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:48:07','2026-09-18 00:48:07'),(64,3,5,'Permohonan Tapak ePerolehan (eP)','F5-01','Memo Iringan Permohonan Tapak eP','Memo kepada Unit Perolehan PKPMP untuk pembukaan tapak sistem ePerolehan.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:48:07','2026-09-18 00:48:07'),(65,3,5,'Permohonan Tapak ePerolehan (eP)','F5-02','Salinan Kelulusan Belanja','Surat / Memo kelulusan peruntukan belanja yang telah diluluskan.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:48:07','2026-09-18 00:48:07'),(66,3,5,'Permohonan Tapak ePerolehan (eP)','F5-03','Borang Senarai Semak Lampiran 2','Senarai semak permohonan tapak ePerolehan mengikut format Unit Perolehan PKPMP.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:48:07','2026-09-18 00:48:07'),(67,3,5,'Permohonan Tapak ePerolehan (eP)','F5-04','Anggaran Jabatan (Departmental Estimate)','Anggaran harga siling jabatan yang dimeterai dan disimpan dalam kerahsiaan.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:48:07','2026-09-18 00:48:07'),(68,3,6,'Pelantikan Jawatankuasa Perolehan','F6-01','Surat Lantikan Jawatankuasa Spesifikasi','Surat lantikan rasmi ahli JK Penyedia Spesifikasi Teknikal.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:48:07','2026-09-18 00:48:07'),(69,3,6,'Pelantikan Jawatankuasa Perolehan','F6-02','Surat Lantikan Jawatankuasa Pembuka','Surat lantikan pegawai pembuka dokumen tawaran sebutharga/tender.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:48:07','2026-09-18 00:48:07'),(70,3,6,'Pelantikan Jawatankuasa Perolehan','F6-03','Surat Lantikan Jawatankuasa Penilai Teknikal & Kewangan','Surat lantikan JK Penilaian Teknikal dan JK Penilaian Kewangan.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:48:07','2026-09-18 00:48:07'),(71,3,7,'Penyediaan Dokumen Pelawaan','F7-01','Dokumen Sebutharga / Tender Lengkap','Draf dokumen pelawaan lengkap yang disahkan oleh JK Spesifikasi.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:48:07','2026-09-18 00:48:07'),(72,3,7,'Penyediaan Dokumen Pelawaan','F7-02','Jadual Pematuhan Spesifikasi Teknikal','Format matriks pematuhan teknikal (Compliance Matrix) untuk diisi oleh petender/pembekal.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:48:07','2026-09-18 00:48:07'),(73,3,7,'Penyediaan Dokumen Pelawaan','F7-03','Jadual Harga & Pecahan Kos Pembekal','Format tawaran harga dan senarai kuantiti (Bill of Quantities).',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:48:07','2026-09-18 00:48:07'),(74,3,8,'Perakuan, Keputusan & Surat Setuju Terima (SST)','F8-01','Kertas Perakuan Pelantikan Pembekal','Kertas pertimbangan perakuan untuk diangkat kepada Lembaga Perolehan (LP).',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:48:07','2026-09-18 00:48:07'),(75,3,8,'Perakuan, Keputusan & Surat Setuju Terima (SST)','F8-02','Laporan Penilaian Teknikal & Kewangan','Laporan penuh penilaian perolehan yang ditandatangani oleh semua ahli jawatankuasa penilai.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:48:07','2026-09-18 00:48:07'),(76,3,8,'Perakuan, Keputusan & Surat Setuju Terima (SST)','F8-03','Minit / Keputusan Kelulusan Lembaga Perolehan (LP)','Cabutan keputusan rasmi kelulusan pelantikan pembekal berjaya oleh Lembaga Perolehan (LP).',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:48:07','2026-09-18 00:48:07'),(77,3,8,'Perakuan, Keputusan & Surat Setuju Terima (SST)','F8-04','Surat Setuju Terima (SST) Bertandatangan','Salinan Surat Setuju Terima (SST) yang telah ditandatangani dan diakui penerimaan oleh pembekal berjaya.',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:48:07','2026-09-18 00:48:07'),(78,3,8,'Perakuan, Keputusan & Surat Setuju Terima (SST)','F8-05','Bon Pelaksanaan & Dokumen Perjanjian Kontrak','Jaminan Bank / Bon Pelaksanaan dan Dokumen Kontrak Rasmi Kerajaan (Wajib jika tempoh pelaksanaan melebihi 4 bulan).',1,0,NULL,NULL,NULL,NULL,'pending',NULL,'2026-09-18 00:48:07','2026-09-18 00:48:07');
/*!40000 ALTER TABLE `procurement_checklist_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `procurement_checklists`
--

DROP TABLE IF EXISTS `procurement_checklists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `procurement_checklists` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `procurement_method` enum('direct_purchase','quotation','tender') NOT NULL DEFAULT 'quotation',
  `estimated_value` decimal(15,2) DEFAULT 0.00,
  `requires_contract` tinyint(1) DEFAULT 0 COMMENT '1 jika tempoh melebihi 4 bulan',
  `contract_period_months` int(11) DEFAULT 0,
  `status` enum('draft','in_progress','completed') DEFAULT 'in_progress',
  `completed_items` int(11) DEFAULT 0,
  `total_items` int(11) DEFAULT 0,
  `notes` text DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_id` (`project_id`),
  CONSTRAINT `fk_checklist_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `procurement_checklists`
--

LOCK TABLES `procurement_checklists` WRITE;
/*!40000 ALTER TABLE `procurement_checklists` DISABLE KEYS */;
INSERT INTO `procurement_checklists` VALUES (1,3,'tender',4500000.00,1,27,'in_progress',0,26,NULL,NULL,'2026-09-17 23:57:47','2026-09-18 00:55:44'),(2,8,'quotation',300000.00,1,24,'in_progress',1,26,'',NULL,'2026-09-18 00:40:53','2026-09-19 14:04:40'),(3,7,'tender',510000.00,1,12,'in_progress',0,26,NULL,NULL,'2026-09-18 00:48:06','2026-09-18 01:04:58');
/*!40000 ALTER TABLE `procurement_checklists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_members`
--

DROP TABLE IF EXISTS `project_members`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role` varchar(100) DEFAULT 'Ahli Pasukan',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_user` (`project_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_members`
--

LOCK TABLES `project_members` WRITE;
/*!40000 ALTER TABLE `project_members` DISABLE KEYS */;
INSERT INTO `project_members` VALUES (1,4,4,'Ahli Pasukan','2026-07-24 08:15:40'),(2,4,1,'Ahli Pasukan','2026-07-24 08:28:45'),(3,7,1,'Ahli Pasukan','2026-07-24 09:25:36'),(4,8,4,'Ahli Pasukan','2026-09-16 17:52:51'),(5,8,1,'Ahli Pasukan','2026-09-16 17:52:59');
/*!40000 ALTER TABLE `project_members` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_code` varchar(20) DEFAULT NULL,
  `name` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `agency` varchar(100) NOT NULL,
  `division` varchar(150) DEFAULT 'Bahagian Teknologi Maklumat (BTM)',
  `unit` varchar(255) DEFAULT NULL,
  `status` enum('Aktif','Lewat','Tertunda','Selesai') DEFAULT 'Aktif',
  `progress` int(11) DEFAULT 0,
  `health` enum('Cemerlang','Baik','Amaran','Berisiko') DEFAULT 'Baik',
  `manager_id` int(11) DEFAULT NULL,
  `vendor` varchar(150) DEFAULT NULL,
  `vendor_manager` varchar(150) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `budget` decimal(15,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `mof_approval_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_code` (`project_code`),
  KEY `manager_id` (`manager_id`),
  CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (3,'PRJ-1784859222','Perolehan Sistem eBajet','Perolehan Sistem eBajet','PKPMP','Bahagian Teknologi Maklumat (BTM)','','Aktif',35,'Amaran',7,'IBS Sdn Bhd','Muhammad Abu bin Ali','2026-07-24','2028-10-24',4500000.00,'2026-07-24 02:13:42','2026-07-27 10:57:14','2025-01-12'),(4,'PRJ-1784865836','Perolehan Pembekalan Laptop, Komputer dan Pencetak bagi PKPMP','Perolehan Pembekalan Laptop, Komputer dan Pencetak bagi PKPMP','PKPMP','Bahagian Teknologi Maklumat (BTM)','','Lewat',20,'Amaran',4,'IT Solution Sdn Bhd','Alif Rakip','2026-08-03','2028-08-03',40000000.00,'2026-07-24 04:03:56','2026-07-27 10:57:02','2025-01-12'),(5,'PRJ-1784881939','Perolehan Sistem PUU','Sistem PUU PKPMP','PKPMP','Bahagian Teknologi Maklumat (BTM)','','Selesai',100,'Cemerlang',8,'Studio Sdn Bhd','Izz Zara','2025-08-12','2026-02-22',3000000.00,'2026-07-24 08:32:19','2026-07-27 10:56:47','2025-01-12'),(6,'PRJ-1784882117','Projek Sistem CMS','Sistem CMS','PKPMP','Bahagian Pendaftaran Mahkamah Persekutuan (BPMP)','','Selesai',70,'Baik',9,'MM Sdn Bhd','Alisa','2026-07-20','2028-07-24',200000.00,'2026-07-24 08:35:17','2026-07-27 10:56:30','2025-01-12'),(7,'PRJ-1784882248','Perolehan Pembekalan Kertas di PKPMP','Pembekalan kertas  di PKPMP untuk 2 Tahun','PKPMP','Bahagian Teknologi Maklumat (BTM)','Unit Aplikasi','Aktif',50,'Amaran',7,'Pine Supplies Sdn. Bhd','Daud','2026-07-20','2027-07-23',510000.00,'2026-07-24 08:37:28','2026-08-03 10:59:43','2025-01-12'),(8,'PRJ-1789581049','Sistem Pengurusan Projek','MY-PMO Sistem Pengurusan Projek','PKPMP','Bahagian Teknologi Maklumat (BTM)','Unit Aplikasi','Aktif',0,'Amaran',1,'Goo Inc','Faris','2026-09-14','2028-09-14',300000.00,'2026-09-16 17:50:49','2026-09-16 17:50:49','2026-09-14');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `smtp_settings`
--

DROP TABLE IF EXISTS `smtp_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smtp_settings` (
  `id` int(11) NOT NULL DEFAULT 1,
  `smtp_host` varchar(255) NOT NULL DEFAULT 'smtp.kehakiman.gov.my',
  `smtp_port` int(11) NOT NULL DEFAULT 587,
  `smtp_encryption` enum('tls','ssl','none') DEFAULT 'tls',
  `smtp_user` varchar(150) DEFAULT 'pmo@kehakiman.gov.my',
  `smtp_pass` varchar(255) DEFAULT '',
  `from_email` varchar(150) NOT NULL DEFAULT 'noreply-mypmo@kehakiman.gov.my',
  `from_name` varchar(100) NOT NULL DEFAULT 'Sistem MY-PMO PKPMP',
  `is_active` tinyint(1) DEFAULT 1,
  `notify_on_risk` tinyint(1) DEFAULT 1,
  `notify_on_overdue_task` tinyint(1) DEFAULT 1,
  `notify_on_payment_due` tinyint(1) DEFAULT 1,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `smtp_settings`
--

LOCK TABLES `smtp_settings` WRITE;
/*!40000 ALTER TABLE `smtp_settings` DISABLE KEYS */;
INSERT INTO `smtp_settings` VALUES (1,'smtp.kehakiman.gov.my',587,'tls','','','noreply-mypmo@kehakiman.gov.my','Sistem MY-PMO PKPMP',1,0,1,1,'2026-09-19 05:54:17');
/*!40000 ALTER TABLE `smtp_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('pending','in_progress','completed') DEFAULT 'pending',
  `priority` enum('Sederhana','Tinggi','Segera') DEFAULT 'Sederhana',
  `assignee_id` int(11) DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  KEY `assignee_id` (`assignee_id`),
  CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`assignee_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES (1,3,'Buat PM 4',NULL,'completed','Tinggi',5,'2026-07-31','2026-07-24 03:09:49'),(5,7,'PM 1',NULL,'completed','Tinggi',4,'2026-07-31','2026-07-27 07:12:23'),(6,7,'PM2',NULL,'completed','Segera',5,'2026-07-31','2026-07-27 07:17:52'),(7,7,'PM 3','bantu pegawai','completed','Segera',9,'2026-07-31','2026-07-27 07:24:42'),(8,7,'Upgrade VM 1','Upgrade VM 1','in_progress','Tinggi',1,'2026-08-06','2026-07-31 02:23:53'),(9,7,'buat pm ke 3','apapa','completed','Segera',9,'2026-08-20','2026-08-17 05:36:51');
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `units`
--

DROP TABLE IF EXISTS `units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `units` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `division_id` int(11) NOT NULL,
  `code` varchar(50) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `division_id` (`division_id`),
  CONSTRAINT `units_ibfk_1` FOREIGN KEY (`division_id`) REFERENCES `divisions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `units`
--

LOCK TABLES `units` WRITE;
/*!40000 ALTER TABLE `units` DISABLE KEYS */;
INSERT INTO `units` VALUES (1,1,'UeK','Unit Kehakiman','','2026-07-24 11:05:49','2026-07-24 11:05:49'),(2,1,'UApps','Unit Aplikasi','','2026-07-24 11:06:28','2026-07-24 11:06:28'),(3,1,'UPortal','Unit Portal dan Integration','','2026-07-24 11:07:44','2026-07-24 11:07:44'),(4,1,'NOC','Unit Rangkaian dan Pusat Data','','2026-07-24 11:08:28','2026-07-24 11:08:28'),(5,1,'ASET','Unit Aset dan Meja Bantuan','','2026-07-24 11:09:32','2026-07-24 11:09:32'),(6,2,'TEST','Test','','2026-07-24 11:26:56','2026-07-24 11:26:56'),(7,2,'testing','testing','testing','2026-08-10 09:34:27','2026-08-10 09:34:27');
/*!40000 ALTER TABLE `units` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL,
  `agency` varchar(100) DEFAULT NULL,
  `status` enum('Aktif','Tidak Aktif') DEFAULT 'Aktif',
  `avatar` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Izzat','admin@kehakiman.gov.my','$2y$10$i0GU8TnBOOpQ0hrtJdGjGOnAHrAgxYHtGZPnPt9C3evnv6PHfTaaa','superadmin','PKPMP','Aktif',NULL,'2026-05-20 06:07:59'),(2,'Ahmad Faiz','faiz@kehakiman.gov.my','$2y$10$NbFmxEiRG8QDaMN7k8aqJuRwzdoJeYMOwjcuYgJ3QKEWo5joQnImi','pmo_gov','PKPMP','Aktif',NULL,'2026-05-20 08:21:00'),(3,'Sarah Lee','sarah@kehakiman.gov.my','$2y$10$NbFmxEiRG8QDaMN7k8aqJuRwzdoJeYMOwjcuYgJ3QKEWo5joQnImi','admin_agency','PKPMP','Aktif',NULL,'2026-07-24 02:37:33'),(4,'Muhammad Izzat Bin Mansor','manager_6a62c9784422d@pmo.gov.my','$2y$10$jERYPnYp24MNG1Syp2b.dObLANr257UCKGiuAuAaeSNX9QJdjb8a.','pmo_gov',NULL,'Aktif',NULL,'2026-07-24 02:10:04'),(5,'Faris','manager_6a62ca5676db8@pmo.gov.my','$2y$10$n21n8ffAmPZPDQjADj3sAeQOnl/wGC6eUtb2JeqqyemhTLGkbrfza','pmo_vendor','Google Inc','Aktif',NULL,'2026-07-24 02:13:42'),(6,'Faris Bin Jazli','manager_6a62e5944a411@pmo.gov.my','$2y$10$sjNV9tfBuSVlZfV6bMfyUOWClzGgTxeZhG7OMn1G/xQvTYReW12c6','pmo_gov',NULL,'Aktif',NULL,'2026-07-24 04:09:56'),(7,'Faris Ali Bin Jazli','manager_6a62e5b528382@pmo.gov.my','$2y$10$ihMvUis7Z403q0f1puiP2ejWMvWftnrs4hikexZAlg0Jxh4SUp0OC','pmo_gov',NULL,'Aktif',NULL,'2026-07-24 04:10:29'),(8,'Ratione ','manager_6a6323137f961@kehakiman.gov.my','$2y$10$inrd6VQQ8vXlKhajT/aRmO3KocjPPQNRyGzsOHpvT6y57WMytlWYq','pmo_gov','PKPMP','Aktif',NULL,'2026-07-24 08:32:19'),(9,'Sarah','manager_6a6323c52c3e6@kehakiman.gov.my','$2y$10$t/KCHmO6YkTZx/uoAoiskO987rw3ha0aPRzKt2iEp0iJmU9pWhWpO','pmo_gov','PKPMP','Aktif',NULL,'2026-07-24 08:35:17'),(10,'Daud','manager_6a63244853bb3@kehakiman.gov.my','$2y$10$61LsYly6VndzOjSVauiTxu.bI/WTtP/N4hkr8rErov/0ifLVvk7MG','pmo_vendor','Sayo Inc','Aktif',NULL,'2026-07-24 08:37:28'),(11,'Izz Zara','zara@gmail.com','$2y$10$3iY/.98rIUkRL/nl3cV/M.WnZ.ptMoBNYZCbFNkJ1GClWtsNLrbHa','pmo_vendor','Google Inc','Aktif',NULL,'2026-07-24 11:39:07');
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

-- Dump completed on 2026-09-22 19:04:09
