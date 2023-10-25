import { RowDataPacket } from "mysql2/promise";
import mysqlPool from "../db";

export const createGroup = async (groupData: { name: string }) => {
  try {
    const connection = await mysqlPool.getConnection();
    const query =
      "INSERT INTO `Group` (name, dateCreated, dateUpdated) VALUES (?, NOW(), NOW())";
    const [results] = await connection.query(query, [groupData.name]);
    connection.release();
    return results;
  } catch (error) {
    throw error;
  }
};

export const getAllGroups = async () => {
  try {
    const connection = await mysqlPool.getConnection();
    const query = "SELECT * FROM `Group`";
    const [results] = await connection.query(query);
    connection.release();
    return results as RowDataPacket[];
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

export const updateGroup = async (
  groupId: number,
  groupData: { name: string }
) => {
  try {
    const connection = await mysqlPool.getConnection();
    const query =
      "UPDATE `Group` SET name = ?, dateUpdated = NOW() WHERE group_id = ?";
    const [results] = await connection.query(query, [groupData.name, groupId]);
    connection.release();
    return results;
  } catch (error) {
    throw error;
  }
};

export const deleteGroup = async (groupId: number) => {
  try {
    const connection = await mysqlPool.getConnection();
    const query = "DELETE FROM `Group` WHERE group_id = ?";
    const [results] = await connection.query(query, [groupId]);
    connection.release();
    return results;
  } catch (error) {
    throw error;
  }
};
