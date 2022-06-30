/* Creating Database */
DROP SCHEMA IF EXISTS `tempdb`;
CREATE SCHEMA `tempdb`;
USE `tempdb`;

/* Creating Admin table */
CREATE TABLE `tempdb`.`admin` (
  `username` VARCHAR(20) NOT NULL,
  `password` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`username`));

/* Creating user table */
CREATE TABLE `tempdb`.`user` (
  `user_id` VARCHAR(36) NOT NULL,
  `base_img` VARCHAR(100) NOT NULL,
  `img_ext` VARCHAR(10) NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `mob_no` VARCHAR(20) NOT NULL UNIQUE,
  `gender` VARCHAR(1) NOT NULL,
  `city` VARCHAR(45) NOT NULL,
  `department` VARCHAR(45) NOT NULL,
  `captured_count` INT NOT NULL DEFAULT 0,
  `date_created` DATE NOT NULL DEFAULT (CURRENT_DATE()),
  `last_modified_by` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`user_id`));
  
/*.Creating user table */
CREATE TABLE `tempdb`.`user_change_log` (
  `change_id` INT NOT NULL AUTO_INCREMENT,
  `change_by` VARCHAR(45) NOT NULL,
  `change_type` VARCHAR(6) NOT NULL,
  `change_timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `user_id` VARCHAR(45) NOT NULL,
  `base_img` VARCHAR(45) NOT NULL,
  `img_ext` VARCHAR(45) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `mob_no` VARCHAR(45) NOT NULL,
  `gender` VARCHAR(45) NOT NULL,
  `city` VARCHAR(45) NOT NULL,
  `department` VARCHAR(45) NOT NULL,
  `date_created` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`change_id`));

/* Creating admin logs table */
CREATE TABLE `tempdb`.`admin_log` (
  `change_id` INT NOT NULL AUTO_INCREMENT,
  `change_by` VARCHAR(20) NOT NULL,
  `change_on` VARCHAR(36) NOT NULL,
  `change_type` VARCHAR(6) NOT NULL,
  `change_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (`change_id`));

/* Trigger for admin_log on insert user */
DELIMITER $$
CREATE DEFINER=`root`@`localhost` TRIGGER `admin_log_on_insert` AFTER INSERT ON `user` FOR EACH ROW BEGIN
	INSERT INTO `admin_log` (`change_by`, `change_on`, `change_type`)
    VALUE (NEW.`last_modified_by`, NEW.`user_id`, "INSERT");
    INSERT INTO `user_change_log` (`change_by`, `change_type`, `user_id`, `base_img`, `img_ext`, `name`, `mob_no`, `gender`, `city`, `department`, `date_created`) 
    VALUE (NEW.`last_modified_by`, "INSERT", NEW.`user_id`, NEW.`base_img`, NEW.`img_ext`, NEW.`name`, NEW.`mob_no`, NEW.`gender`, NEW.`city`, NEW.`department`, NEW.`date_created`);
END$$
DELIMITER ;

/* Trigger for admin_log on update user */
DELIMITER $$
CREATE DEFINER=`root`@`localhost` TRIGGER `admin_log_on_update` AFTER UPDATE ON `user` FOR EACH ROW BEGIN
    IF (NEW.`base_img` != OLD.`base_img` OR NEW.`name` != OLD.`name` OR NEW.`mob_no` != OLD.`mob_no` OR NEW.`gender` != OLD.`gender` OR NEW.`city` != OLD.`city` OR NEW.`department` != OLD.`department`) THEN
        INSERT INTO `admin_log` (`change_by`, `change_on`, `change_type`)
		VALUE (NEW.`last_modified_by`, NEW.`user_id`, "UPDATE");
        INSERT INTO `user_change_log` (`change_by`, `change_type`, `user_id`, `base_img`, `img_ext`, `name`, `mob_no`, `gender`, `city`, `department`, `date_created`) 
		VALUE (NEW.`last_modified_by`, "INSERT", NEW.`user_id`, NEW.`base_img`, NEW.`img_ext`, NEW.`name`, NEW.`mob_no`, NEW.`gender`, NEW.`city`, NEW.`department`, NEW.`date_created`);
    END IF;
END$$
DELIMITER ;

/* Get user view */
CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `tempdb`.`get_user` AS
    SELECT 
		`tempdb`.`user`.`user_id` AS `user_id`,
        `tempdb`.`user`.`base_img` AS `base_img`,
        `tempdb`.`user`.`name` AS `name`,
        `tempdb`.`user`.`mob_no` AS `mob_no`,
        `tempdb`.`user`.`gender` AS `gender`,
        `tempdb`.`user`.`city` AS `city`,
        `tempdb`.`user`.`department` AS `department`,
        `tempdb`.`user`.`date_created` AS `date_created`
    FROM
        `tempdb`.`user`;
        
/* Increment capture_count procedure */
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `increment_capture_counter`(IN usr_id VARCHAR(36))
BEGIN
UPDATE `user` SET `captured_count` = `captured_count`+1 WHERE `user_id` = usr_id;
SELECT `captured_count` FROM `user` WHERE `user_id` = usr_id;
END$$
DELIMITER ;