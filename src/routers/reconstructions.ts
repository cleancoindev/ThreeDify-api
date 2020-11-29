import { Router } from 'express';

import { uploadImages } from '../middlewares/uploadImage';
import authenticateUser from '../middlewares/authenticateUser';
import ReconstructionController from '../controllers/reconstructions';
import validateNewReconstruction from '../middlewares/validateNewReconstruction';

const router: Router = Router();

const imageUploadMiddlewares = uploadImages('images');

/**
 * @swagger
 *
 * /reconstructions:
 *  get:
 *    description: End point to fetch all reconstructions.
 *    parameters:
 *      - $ref: '#/components/parameters/q'
 *      - $ref: '#/components/parameters/page'
 *      - $ref: '#/components/parameters/size'
 *      - $ref: '#/components/parameters/reconstruction_filters'
 *      - $ref: '#/components/parameters/order'
 *    responses:
 *      200:
 *        $ref: '#/components/responses/PaginatedReconstructionResult'
 *      404:
 *        $ref: '#/components/responses/HTTPError'
 *      500:
 *        $ref: '#/components/responses/HTTPError'
 */
router.get('/', ReconstructionController.index);

/**
 * @swagger
 *
 * /reconstructions/batch:
 *  put:
 *    description: End point to fetch reconstructions batch for processing.
 *                 Also updates the reconstructions to in progress state.
 *    parameters:
 *      - $ref: '#/components/parameters/size'
 *    responses:
 *      200:
 *        description: A list of queued reconstructions to process.
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Reconstruction'
 *      404:
 *        $ref: '#/components/responses/HTTPError'
 *      500:
 *        $ref: '#/components/responses/HTTPError'
 */
router.put('/batch', ReconstructionController.reconstructionBatch);

/**
 * @swagger
 *
 * /reconstructions/{id}:
 *  get:
 *    description: End point to fetch details of a reconstruction.
 *    parameters:
 *      - name: id
 *        in: path
 *        description: Id of reconstruction to fetch.
 *    responses:
 *      200:
 *        $ref: '#/components/responses/Reconstruction'
 *      404:
 *        $ref: '#/components/responses/HTTPError'
 *      500:
 *        $ref: '#/components/responses/HTTPError'
 */
router.get('/:id', ReconstructionController.reconstruction);

/**
 * @swagger
 *
 * /reconstructions/{id}/failed:
 *  put:
 *    description: End point to set reconstruction state to failed. This changes the state to `IN QUEUE`.
 *    parameters:
 *      - name: id
 *        in: path
 *        description: Id of reconstruction.
 *    responses:
 *      200:
 *        description: OK
 *        content:
 *          text/plain:
 *            schema:
 *              type: string
 *      404:
 *        $ref: '#/components/responses/HTTPError'
 *      500:
 *        $ref: '#/components/responses/HTTPError'
 */
router.put('/:id/failed', ReconstructionController.reconstructionFailed);

/**
 * @swagger
 *
 * /reconstructions/create:
 *  post:
 *    description: End point to create new reconstruction.
 *    security:
 *      - Authentication: []
 *    requestBody:
 *      $ref: '#/components/requestBodies/NewReconstruction'
 *    responses:
 *      200:
 *        $ref: '#/components/responses/ReconstructionCreationResponse'
 *      401:
 *        $ref: '#/components/responses/HTTPError'
 *      422:
 *        $ref: '#/components/responses/ValidationErrorResponse'
 *      500:
 *        $ref: '#/components/responses/HTTPError'
 */
router.post(
  '/create',
  authenticateUser,
  imageUploadMiddlewares[0],
  validateNewReconstruction,
  imageUploadMiddlewares[1],
  ReconstructionController.create
);

export default router;
