import { authenticate } from "../middleware/auth.middleware.js";
import { csrfProtection } from "../middleware/csrf.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import * as productController from "../controllers/product.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { productSchema } from "../utils/validationSchema.js";
import { authorizeRoles } from "../middleware/authorizeRoles.middleware.js";

const router = express.Router();
// router.use(authenticate);

router.route("/").post(
  authenticate,
  authorizeRoles("admin"),
  csrfProtection,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  validate(productSchema),
  productController.createProduct
);

router.route("/:slug").get(productController.getProductDetailsForCustomer);
router
  .route("/:productId")
  .get(
    authenticate,
    authorizeRoles("admin"),
    productController.getProductDetailsAdmin
  );

router.route("/catalog-search").get(productController.searchCatalog);

router.route("/suggest-product").post(
  authenticate,
  authorizeRoles("seller"),
  csrfProtection,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  validate(productSchema),
  productController.suggestNewProduct
);

router
  .route("/review/pending")
  .get(
    authenticate,
    authorizeRoles("admin"),
    productController.getPendingProductsForReview
  );
router
  .route("/review/:productId")
  .patch(
    authenticate,
    authorizeRoles("admin"),
    csrfProtection,
    productController.reviewProduct
  );

router.route("/edit/:productId").patch(
  authenticate,
  authorizeRoles("admin"),
  csrfProtection,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  validate(productSchema),
  productController.updateProduct
);

router
  .route("/:id")
  .delete(
    authenticate,
    authorizeRoles("seller", "admin"),
    csrfProtection,
    productController.deleteProduct
  );

export default router;
