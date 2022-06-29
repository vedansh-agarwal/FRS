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
  
/* Creating admin logs table */
CREATE TABLE `tempdb`.`admin_log` (
  `change_id` INT NOT NULL AUTO_INCREMENT,
  `change_by` VARCHAR(20) NOT NULL,
  `change_on` VARCHAR(36) NOT NULL,
  `change_type` VARCHAR(6) NOT NULL,
  `change_values` VARCHAR(400) NOT NULL,
  `change_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (`change_id`));

/* Trigger for admin_log on insert user */
DELIMITER $$
CREATE DEFINER = CURRENT_USER TRIGGER `tempdb`.`admin_log_on_insert` AFTER INSERT ON `user` FOR EACH ROW
BEGIN
	SET @change_values = CONCAT("base_img = '", NEW.`base_img`, "'");
	SET @change_values = CONCAT(@change_values, ", name='", NEW.`name`, "'");
	SET @change_values = CONCAT(@change_values, ", mob_no='", NEW.`mob_no`, "'");
	SET @change_values = CONCAT(@change_values, ", gender='", NEW.`gender`, "'");
	SET @change_values = CONCAT(@change_values, ", city='", NEW.`city`, "'");
	SET @change_values = CONCAT(@change_values, ", department='", NEW.`department`, "'");
	INSERT INTO `admin_log` (`change_by`, `change_on`, `change_type`,`change_values`)
    VALUE (NEW.`last_modified_by`, NEW.`user_id`, "INSERT", @change_values);
END$$
DELIMITER ;

/* Trigger for admin_log on update user */
DELIMITER $$
CREATE DEFINER = CURRENT_USER TRIGGER `tempdb`.`admin_log_on_update` AFTER UPDATE ON `user` FOR EACH ROW
BEGIN
	SET @change_values = "";
    IF (NEW.`base_img` != OLD.`base_img`) THEN
        SET @change_values = CONCAT(@change_values, "base_img='", NEW.`base_img`, "'");
    END IF;
    IF (NEW.`name` != OLD.`name`) THEN
        SET @change_values = CONCAT(@change_values, " name='", NEW.`name`, "'");
    END IF;
    IF (NEW.`mob_no` != OLD.`mob_no`) THEN
        SET @change_values = CONCAT(@change_values, " mob_no='", NEW.`mob_no`, "'");
    END IF;
    IF (NEW.`gender` != OLD.`gender`) THEN
        SET @change_values = CONCAT(@change_values, " gender='", NEW.`gender`, "'");
    END IF;
    IF (NEW.`city` != OLD.`city`) THEN
        SET @change_values = CONCAT(@change_values, " city='", NEW.`city`, "'");
    END IF;
    IF (NEW.`department` != OLD.`department`) THEN
        SET @change_values = CONCAT(@change_values, " department='", NEW.`department`, "'");
    END IF;
	INSERT INTO `admin_log` (`change_by`, `change_on`, `change_type`,`change_values`)
    VALUE (NEW.`last_modified_by`, NEW.`user_id`, "UPDATE",@change_values);
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