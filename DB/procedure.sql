CREATE PROCEDURE tokenAdd(
	IN _id INT,
	IN _value VARCHAR(6),
	IN _userid INT(11),
	IN _used BOOL,
)
BEGIN
	IF (Not Exists(select * from tokens where value = _value)) THEN
        INSERT INTO tokens (value,userid)
        VALUES(_value,_userid,);
        SET _id = last_insert_id();
        SELECT _id AS id;
        SELECT FORMAT (getdate(), 'dd/MM/yyyy, hh:mm:ss ') as createdOn;
	END IF;
END