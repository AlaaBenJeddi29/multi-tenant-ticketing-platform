import type {
  NextFunction,
  Response,
} from "express";

import { requireParam } from "../../../lib/params.js";

import type {
  AuthenticatedRequest,
} from "../../../middleware/auth.middleware.js";

import {
  createAssetSchema,
} from "../dto/create-asset.dto.js";

import {
  updateAssetSchema,
} from "../dto/update-asset.dto.js";

import {
  listAssetsQuerySchema,
} from "../dto/list-assets.dto.js";

import * as assetsService
from "../services/assets.service.js";

export async function getAssets(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const query =
      listAssetsQuerySchema.parse(req.query);

    const assets =
      await assetsService.getAssets(
        req.user!.organizationId,
        query
      );

    return res.status(200).json(assets);
  } catch (error) {
    next(error);
  }
}

export async function getAsset(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const asset =
      await assetsService.getAssetById(
        requireParam(req.params.id, "id"),
        req.user!.organizationId
      );

    return res.status(200).json(asset);
  } catch (error) {
    next(error);
  }
}

export async function createAsset(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const body =
      createAssetSchema.parse(req.body);

    const asset =
      await assetsService.createNewAsset(
        body,
        req.user!.organizationId
      );

    return res.status(201).json(asset);
  } catch (error) {
    next(error);
  }
}

export async function updateAsset(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const body =
      updateAssetSchema.parse(req.body);

    const asset =
      await assetsService.editAsset(
        requireParam(req.params.id, "id"),
        req.user!.organizationId,
        body
      );

    return res.status(200).json(asset);
  } catch (error) {
    next(error);
  }
}

export async function activateAsset(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const asset =
      await assetsService.activateAsset(
        requireParam(req.params.id, "id"),
        req.user!.organizationId
      );

    return res.status(200).json(asset);
  } catch (error) {
    next(error);
  }
}

export async function maintenanceAsset(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const asset =
      await assetsService.maintenanceAsset(
        requireParam(req.params.id, "id"),
        req.user!.organizationId
      );

    return res.status(200).json(asset);
  } catch (error) {
    next(error);
  }
}

export async function retireAsset(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const asset =
      await assetsService.retireAsset(
        requireParam(req.params.id, "id"),
        req.user!.organizationId
      );

    return res.status(200).json(asset);
  } catch (error) {
    next(error);
  }
}

export async function deleteAsset(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    await assetsService.removeAsset(
      requireParam(req.params.id, "id"),
      req.user!.organizationId
    );

    return res.status(200).json({
      message:
        "Asset deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
}