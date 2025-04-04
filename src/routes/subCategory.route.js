import {Router} from 'express';
import { createSub, deleteSubCategory, getAllSubCategoryByIDAndName, getAllSubCategoryData, updateSubCategory, viewSubCategory} from '../controllers/subCategory.controller.js';



const router =Router();


router.route('/getAllNameIdSubcategories').get(getAllSubCategoryByIDAndName);
router.route('/subcategories').get(getAllSubCategoryData);
router.route('/create').post(createSub);
router.route('/view/:categoryId').get(viewSubCategory);
router.route('/update/:categoryId').put(updateSubCategory);
router.route('/delete/:categoryId').delete(deleteSubCategory);
export default router;