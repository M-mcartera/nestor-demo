import { Request, Response } from "express";
import * as personService from "../services/person.service";

export const createPerson = async (req: Request, res: Response) => {
  try {
    const personData = req.body;
    const result = await personService.createPerson(personData);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error creating person" });
  }
};

export const getAllPersons = async (req: Request, res: Response) => {
  try {
    const persons = await personService.getAllPersons();
    res.status(200).json(persons);
  } catch (error) {
    res.status(500).json({ error: "Error fetching persons" });
  }
};

export const updatePerson = async (req: Request, res: Response) => {
  const personId = parseInt(req.params.personId);
  const personData = req.body;

  try {
    const result = await personService.updatePerson(personId, personData);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error updating person" });
  }
};

export const deletePerson = async (req: Request, res: Response) => {
  const personId = parseInt(req.params.personId);

  try {
    const result = await personService.deletePerson(personId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error deleting person" });
  }
};

export const getPersonHierarchyGroups = async (req: Request, res: Response) => {
  try {
    const personId = parseInt(req.params.personId);
    const result = await personService.getPersonHierarchy(personId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
