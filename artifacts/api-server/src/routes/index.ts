import { Router, type IRouter } from "express";
import healthRouter from "./health";
import projectsRouter from "./projects";
import servicesRouter from "./services";
import journalRouter from "./journal";
import leadsRouter from "./leads";
import siteRouter from "./site";

const router: IRouter = Router();

router.use(healthRouter);
router.use(projectsRouter);
router.use(servicesRouter);
router.use(journalRouter);
router.use(leadsRouter);
router.use(siteRouter);

export default router;
