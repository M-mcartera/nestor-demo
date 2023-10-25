import express from "express";
import * as groupController from "../controllers/group.controller";
import * as personController from "../controllers/person.controller";

const router = express.Router();

router.post("/groups", groupController.createGroup);
router.get("/groups", groupController.getAllGroups);
router.put("/groups/:groupId", groupController.updateGroup);
router.delete("/groups/:groupId", groupController.deleteGroup);

router.post("/persons", personController.createPerson);
router.get("/persons", personController.getAllPersons);
router.put("/persons/:personId", personController.updatePerson);
router.delete("/persons/:personId", personController.deletePerson);

export default router;
