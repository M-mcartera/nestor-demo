import { RowDataPacket } from "mysql2/promise";
import mysqlPool from "../db";
import { Person, UpdatePersonRequest } from "../dto";

export const createPerson = async (personData: Person) => {
  try {
    const connection = await mysqlPool.getConnection();
    const query =
      "insert into Person (firstname, lastname, jobtitle, dateCreated, dateUpdated, group_id) values (?, ?, ?, NOW(), NOW(), ?)";
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
    const query = "select * from Person";
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
      "update Person set firstname = ?, lastname = ?, jobtitle = ?, dateUpdated = NOW(), group_id = ? where person_id = ?";
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
    const query = "delete from Person where person_id = ?";
    const [results] = await connection.query(query, [personId]);
    connection.release();
    return results;
  } catch (error) {
    throw error;
  }
};

export const getPersonHierarchy = async (personId: number) => {
  try {
    const connection = await mysqlPool.getConnection();
    const [groupsResponse] = await connection.execute(
      `
        with recursive GroupHierarchy as (
          select group_id, name, parent_group_id
          from \`Group\`
          where group_id = (select group_id from Person where person_id = ?)
          union all
          select g.group_id, g.name, g.parent_group_id
          from \`Group\` as g
          inner join GroupHierarchy as gh on g.group_id = gh.parent_group_id
        )
        select * from GroupHierarchy;
        `,
      [personId]
    );

    const [personResponse] = await connection.execute(
      "select * from Person where person_id = ?",
      [personId]
    );

    connection.release();

    return {
      person: personResponse,
      groups: groupsResponse,
    };
  } catch (err) {
    console.log({ err });
    throw err;
  }
};
