import {Router} from 'express';
import { createCategory, deleteCategory, getAllCategoryByIDAndName, getAllCategoryData, updateCategory, viewCategory } from '../controllers/category.controller.js';


const router =Router();

router.route('/getnameidcategory').get(getAllCategoryByIDAndName);
router.route('/categories').get(getAllCategoryData);
router.route('/create').post(createCategory);
router.route('/view/:categoryId').get(viewCategory);
router.route('/update/:categoryId').put(updateCategory);
router.route('/delete/:categoryId').delete(deleteCategory);



export default router;