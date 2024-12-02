const express = require("express")
const Employee = require('../src/modules/employeeSchema')
const router = express.Router();
const {body, validationResult} = require("express-validator")

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors){
        return res.status(400).json({errors: errors.array()})
    }
    next();
}

router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find();
        //res.status(200).json({ Message: "Here are all the current Employees :", Employees: employees})
        res.send({ Message: "Here are all the current Employees :", Employees: employees})
    } catch (e) {
        res.status(500).json({error: "Error fetching employees", e})
    }
}) 


router.post(
    '/',
    [
        body('_id').isInt().withMessage('ID must be an integer'),
        body('first_name').isString().withMessage('First name is required'),
        body('last_name').isString().withMessage('Last name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('position').isString().withMessage('Position is required'),
        body('salary').isNumeric().withMessage('Salary must be a number'),
        body('date_of_joining').isDate().withMessage('Date of joining must be a valid Data'),
        body('department').isString().withMessage('Department is required')
    ],
    handleValidationErrors, 
    async (req, res) => {
        console.log("This is the res", req.body)
        try{
            const newEmp = new Employee(req.body);
            await newEmp.save();
            res.send({message: "New Employee Created: " , Details: newEmp, created: true})
        } catch(e) {
            res.send({Message: "There was an error creating an Employee: " + e,  created: false})
        }
    }
)

router.get('/:_id', async (req, res) => {
    try{
        const { _id } = req.params;
        const employee = await Employee.findById(_id)
        if(employee) {
            res.status(200).json({ Message: "Employee User", Employee: employee})
        } else {
            res.status(400).json({ Message: "Employee not found" })
        }
    }catch(e){
        res.send(500).json("There was an error getting Employee by Id")
    }
})

router.put('/:_id',
    [
        body('first_name').isString().withMessage('First name is required'),
        body('last_name').isString().withMessage('Last name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('position').isString().withMessage('Position is required'),
        body('salary').isNumeric().withMessage('Salary must be a number'),
        body('department').isString().withMessage('Department is required'),
    ],
    handleValidationErrors,
    async(req, res) =>{
    try{
        const {_id} = req.body;
        console.log("req body", req.body)
        const updatedEmployee = await Employee.findByIdAndUpdate(_id, req.body, {new: true});
        console.log(updatedEmployee)
        if (updatedEmployee) {
            res.send({Message: "Employee Updated", Employee: updatedEmployee, created: true})
        } else {
            res.send({Message: "Employee Not Found", created: false})
        }
    } catch (e){
        res.status(500).json({Error: e, created: false});
}})


router.delete("/", async(req, res) =>{
    try{
        const { _id } = req.body;
        const deletedEmployee = await Employee.findByIdAndDelete(_id)
        if (deletedEmployee){
            res.send({Message: "Employee Deleted", Employee: Employee, deleted: true})
        } else {
            res.send({Message: "Employee Not Found", deleted: false})
        }
    } catch(e) {
        res.send({Message: "Error " + e})
    }
})


module.exports = router;