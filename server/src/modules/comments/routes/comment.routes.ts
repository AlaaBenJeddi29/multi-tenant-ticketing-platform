import { Router } from "express";

import { authenticate } from "../../../middleware/auth.middleware.js";

import * as commentController from "../controllers/comment.controller.js";

const router = Router();

router.use(authenticate);

router.get(
  "/ticket/:ticketId",
  commentController.getComments
);

router.post(
  "/ticket/:ticketId",
  commentController.createComment
);

router.delete(
  "/:id",
  commentController.deleteComment
);

export default router;