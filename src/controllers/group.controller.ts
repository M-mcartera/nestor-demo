import { Request, Response } from "express";
import * as groupService from "../services/group.service";

export const createGroup = async (req: Request, res: Response) => {
  try {
    const groupData = req.body;
    const result = await groupService.createGroup(groupData);
    res.status(201).json(result);
  } catch (error) {
    console.log({ error });
    res.status(500).json({ error: "Error creating group" });
  }
};

export const getAllGroups = async (req: Request, res: Response) => {
  try {
    const groups = await groupService.getAllGroups();
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ error: "Error fetching groups" });
  }
};

export const updateGroup = async (req: Request, res: Response) => {
  const groupId = parseInt(req.params.groupId);
  const groupData = req.body;

  try {
    const result = await groupService.updateGroup(groupId, groupData);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error updating group" });
  }
};

export const deleteGroup = async (req: Request, res: Response) => {
  const groupId = parseInt(req.params.groupId);

  try {
    const result = await groupService.deleteGroup(groupId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error deleting group" });
  }
};

export const getAllGroupsAndPersons = async (req: Request, res: Response) => {
  try {
    const result = await groupService.getAllGroupsAndPersons();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPersonsByGroupId = async (req: Request, res: Response) => {
  try {
    const groupId = parseInt(req.params.groupId);
    const queryParams = req.query;
    const { firstname, jobTitle } = queryParams;
    const result = await groupService.getPersonsByGroupId(
      groupId,
      jobTitle as string,
      firstname as string
    );
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Get persons by group id error" });
  }
};
