import { RowDataPacket } from "mysql2/promise";
import mysqlPool from "../db";
import { Person, UpdatePersonRequest } from "../dto";

export const createPerson = async (personData: Person) => {
  try {
    const connection = await mysqlPool.getConnection();
    const query =
      "INSERT INTO Person (firstname, lastname, jobtitle, dateCreated, dateUpdated, group_id) VALUES (?, ?, ?, NOW(), NOW(), ?)";
    const { firstname, lastname, jobtitle, group_id } = personData;
    const [results] = await connection.query(query, [
      firstname,
      lastname,
      jobtitle,
      group_id,
    ]);
    connection.release();
    return results;
  } catch (error) {
    throw error;
  }
};

export const getAllPersons = async () => {
  try {
    const connection = await mysqlPool.getConnection();
    const query = "SELECT * FROM Person";
    const [results] = await connection.query(query);
    connection.release();
    return results as RowDataPacket[];
  } catch (error) {
    throw error;
  }
};

export const updatePerson = async (
  personId: number,
  personData: UpdatePersonRequest
) => {
  try {
    const connection = await mysqlPool.getConnection();
    const query =
      "UPDATE Person SET firstname = ?, lastname = ?, jobtitle = ?, dateUpdated = NOW(), group_id = ? WHERE person_id = ?";
    const { firstname, lastname, jobtitle, group_id } = personData;
    const [results] = await connection.query(query, [
      firstname,
      lastname,
      jobtitle,
      group_id,
      personId,
    ]);
    connection.release();
    return results;
  } catch (error) {
    throw error;
  }
};

export const deletePerson = async (personId: number) => {
  try {
    const connection = await mysqlPool.getConnection();
    const query = "DELETE FROM Person WHERE person_id = ?";
    const [results] = await connection.query(query, [personId]);
    connection.release();
    return results;
  } catch (error) {
    throw error;
  }
};
