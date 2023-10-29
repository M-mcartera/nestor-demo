import { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import mysqlPool from "../db";

interface Group {
  group_id: number;
  name: string;
  parent_group_id: number | null;
}

interface Person {
  person_id: number;
  firstname: string;
  lastname: string;
  jobtitle: string;
  group_id: number;
}

interface GroupTree extends Group {
  groups: HierarchyNode[];
  persons: Person[];
}
interface HierarchyNode {
  group: GroupTree | null;
}

export const createGroup = async (groupData: {
  name: string;
  parent_group_id: number;
}) => {
  try {
    const connection = await mysqlPool.getConnection();
    const query =
      "insert into `Group` (name, dateCreated, dateUpdated, parent_group_id) values (?, NOW(), NOW(), ?)";
    const insertedResult = await connection.query(query, [
      groupData.name,
      groupData.parent_group_id,
    ]);

    const createdGroupId = (insertedResult[0] as ResultSetHeader).insertId;

    const selectQuery = "select * from `Group` where group_id = ?";

    const [selectResults] = await connection.query(selectQuery, [
      createdGroupId,
    ]);

    const selectResult = selectResults as ResultSetHeader;
    connection.release();

    if (!!selectResult) {
      return selectResult;
    } else {
      throw new Error("Group not found after creation");
    }
  } catch (error) {
    throw error;
  }
};

export const getAllGroups = async () => {
  try {
    const connection = await mysqlPool.getConnection();
    const query = "select * from `Group`";
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
  groupData: { name: string; parent_group_id: number }
) => {
  try {
    const connection = await mysqlPool.getConnection();
    const query =
      "update `Group` set name = ?, parent_group_id = ?, dateUpdated = NOW() where group_id = ?";
    const updatedResult = await connection.query(query, [
      groupData.name,
      groupData.parent_group_id,
      groupId,
    ]);

    const selectQuery = "select * from `Group` where group_id = ?";

    const [selectResults] = await connection.query(selectQuery, [groupId]);

    const selectResult = selectResults as ResultSetHeader;
    connection.release();

    if (!!selectResult) {
      return selectResult;
    } else {
      throw new Error("Group not found after creation");
    }
  } catch (error) {
    throw error;
  }
};

export const deleteGroup = async (groupId: number) => {
  try {
    const connection = await mysqlPool.getConnection();
    const query = "delete from `Group` where group_id = ?";
    const [results] = await connection.query(query, [groupId]);
    connection.release();
    return results;
  } catch (error) {
    throw error;
  }
};

const createHierarchy = (
  groups: Group[],
  persons: Person[],
  parentGroupId: number | null
): HierarchyNode[] => {
  const treeNodes: HierarchyNode[] = [];

  for (const group of groups) {
    if (group.parent_group_id === parentGroupId) {
      const node: HierarchyNode = {
        group: {
          group_id: group.group_id,
          name: group.name,
          parent_group_id: group.parent_group_id,
          persons: [],
          groups: createHierarchy(groups, persons, group.group_id),
        },
      };

      for (const person of persons) {
        if (person.group_id === group.group_id) {
          node.group?.persons.push(person);
        }
      }

      treeNodes.push(node);
    }
  }

  return treeNodes;
};

export const getAllGroupsAndPersons = async () => {
  try {
    const connection = await mysqlPool.getConnection();
    const groupsQuery = "select * from `Group`";
    const [groupsResponse] = await connection.query(groupsQuery);

    const groups: Group[] = groupsResponse as Group[];

    const personsQuery = "select * from Person";
    const [personsResponse] = await connection.query(personsQuery);

    const persons: Person[] = personsResponse as Person[];
    connection.release();

    const rootTree: HierarchyNode[] = createHierarchy(groups, persons, null);
    return rootTree;
  } catch (err) {
    console.log({ err });
    throw err;
  }
};

export const getPersonsByGroupId = async (
  groupId: number,
  jobTitle?: string,
  firstname?: string
) => {
  try {
    const connection = await mysqlPool.getConnection();

    let personsUnderGroupQuery = `select
    g.group_id,
    g.name AS group_name,
    g.parent_group_id,
    p.person_id,
    p.firstname,
    p.lastname,
    p.jobtitle
    from \`Group\` g
    left join Person p on g.group_id = p.group_id
    where g.group_id = ?
    `;

    if (firstname) {
      personsUnderGroupQuery += `and (p.firstname LIKE '%${firstname}%')`;
    }
    if (jobTitle) {
      personsUnderGroupQuery += `and (p.jobtitle LIKE '%${jobTitle}%')`;
    }

    const [personsUnderGroup] = await connection.execute(
      personsUnderGroupQuery,
      [groupId]
    );

    const groupsUnderGroupQuery = `with recursive GroupsHierarchy as (
      select * from \`Group\` where group_id = ?
      union all 
      select gb.* from \`Group\` gb
      join GroupsHierarchy on gb.parent_group_id = GroupsHierarchy.group_id
    )
    
    select * from GroupsHierarchy;`;

    const [groupsUnderGroup] = await connection.execute(groupsUnderGroupQuery, [
      groupId,
    ]);

    connection.release();

    return {
      persons: personsUnderGroup as Person[],
      groups: groupsUnderGroup as Group[],
    };
  } catch (err) {
    console.log("Get  persons by group id error", err);
    throw err;
  }
};
