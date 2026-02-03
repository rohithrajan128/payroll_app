import Vue from 'vue'
import Router from "vue-router";
// import HomeView from '../views/HomeView.vue'

Vue.use(Router)

function guardMyroute(to, from, next) {
  var isAuthenticated = false;
  if (localStorage.getItem('user'))
    isAuthenticated = true;
  else
    isAuthenticated = false;
  if (isAuthenticated) {
    next(); // allow to enter route
  }
  else {
    next('/'); // go to '/login';
  }
}

export default new Router({
  scrollBehavior() {
    return window.scrollTo({ top: 0, behavior: "smooth" });
  },
  // mode: 'history',
  routes: [

    //Admin Routes start- Register-Login Pages 
    {
      path: "/",
      name: "login",
      meta: { layout: "userpages" },
      component: () => import("../Admin/UserPages/Login.vue")
    },
    {
      path: "/register_user",
      name: "register_user",
      meta: { layout: "userpages" },
      component: () => import("../Admin/UserPages/Register.vue")
    },
    {
      path: "/register",
      name: "register",
      meta: { layout: "userpages" },
      component: () => import("../Admin/UserPages/OtpValidation.vue")
    },
    {
      path: "/forgot_password",
      name: "forgot_password",
      meta: { layout: "userpages" },
      component: () => import("../Admin/UserPages/ForgotPassword.vue")
    },
    {
      path: '/reset_password_form',
      name: 'reset_password_form',
      component: () =>
        import('../Admin/UserPages/ResetPasswordForm.vue'),
      meta: { layout: 'userpages' },
    },
    {
      path: "/reset_password",
      name: "reset_password",
      beforeEnter: guardMyroute,
      component: () => import("../Admin/UserPages/ResetPassword.vue")
    },

    //After Login Pages

    //Dashboard
    {
      path: "/dashboard",
      name: "dashboard",
      beforeEnter: guardMyroute,
      component: () => import("../Admin/Pages/Dashboard.vue")
    },

    //Roles
    {
      path: "/roles",
      name: "roles",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Role/Index.vue"),
    },
    {
      path: "/roles_amend",
      name: "roles_amend",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Role/RolesAmend.vue"),
    },
    {
      path: "/roles_menu",
      name: "roles_menu",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Role/RoleMenu/MenuAccess")
    },

    //Menus
    {
      path: "/menus",
      name: "menus",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Menu/Index.vue"),
    },
    {
      path: "/menu_amend",
      name: "menu_amend",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Menu/MenusAmend.vue"),
    },

    //Lookups
    {
      path: "/lookups",
      name: "lookups",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Lookups/Index.vue"),
    },
    {
      path: "/lookups_amend",
      name: "lookups_amend",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Lookups/LookupsAmend.vue"),
    },
    {
      path: "/child_lookups",
      name: "child_lookups",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Lookups/ChildIndex.vue"),
    },
    {
      path: "/system_parameter",
      name: "system_parameter",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/SystemParameter/Index.vue"),
    },
    {
      path: "/system_parameter_amend",
      name: "system_parameter_amend",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/SystemParameter/SystemParameterAmend.vue"),
    },
    {
      path: "/email_template",
      name: "email_template",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/EmailTemplates/Index.vue"),
    },
    {
      path: "/email_template_amend",
      name: "email_template_amend",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/EmailTemplates/EmailTemplateAmend.vue"),
    },

    //Users
    {
      path: "/users",
      name: "users",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Users/Index.vue")
    },
    {
      path: "/users.amend",
      name: "users.amend",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Users/UsersAmend.vue")
    },
    {
      path: "/users.view",
      name: "users.view",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Users/UserView.vue")
    },

    //countries
    {
      name: "countries",
      path: "/countries",
      beforeEnter: guardMyroute,
      component: () =>
        import(
          "../Admin/Pages/Configuration/Countries/CountriesIndex.vue"
        )
    },
    {
      name: "countries.amend",
      path: "/countries.amend",
      beforeEnter: guardMyroute,
      component: () =>
        import(
          "../Admin/Pages/Configuration/Countries/CountriesAmend.vue"
        )
    },
    {
      name: "states",
      path: "/states",
      beforeEnter: guardMyroute,
      component: () =>
        import(
          "../Admin/Pages/Configuration/Countries/StatesIndex.vue"
        )
    },
    {
      name: "states.amend",
      path: "/states.amend",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Countries/StatesAmend.vue")
    },
    {
      name: "cities",
      path: "/cities",
      beforeEnter: guardMyroute,
      component: () =>
        import(
          "../Admin/Pages/Configuration/Countries/CitiesIndex.vue"
        )
    },
    {
      name: "cities.amend",
      path: "/cities.amend",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Countries/CitiesAmend.vue")
    },

    //organisation
    {
      name: "organisation",
      path: "/organisation",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Organisation/OrganisationIndex.vue")
    },
    {
      name: "organisation.amend",
      path: "/organisation.amend",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Organisation/OrganisationAmend.vue")
    },
    //Asset management
    {
      path: "/categories",
      name: "categories",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/AssetManagement/AssetIndex.vue")
    },
    {
      path: "/categories.amend",
      name: "categories.amend",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/AssetManagement/AssetAmend.vue")
    },

    //Asset details
    {
      path: "/assetdetails",
      name: "assetdetails",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/AssetDetails/AssetDetailsIndex.vue")
    },
    {
      path: "/assetdetails.amend",
      name: "assetdetails.amend",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/AssetDetails/AssetDetailsAmend.vue")
    },

    //Location
    {
      path: "/location",
      name: "location",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Location/LocationIndex.vue")
    },
    {
      path: "/location.amend",
      name: "location.amend",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Location/LocationAmend.vue")
    },

    //Holiday
    {
      path: "/holiday",
      name: "holiday",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Holiday/HolidayIndex.vue")
    },
    {
      path: "/holiday.amend",
      name: "holiday.amend",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Holiday/HolidayAmend.vue")
    },
    {
      name: "user.profile",
      path: "/user.profile",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Users/UserProfile.vue")
    },
    {
      name: "education.details",
      path: "/education.details",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Users/EducationDetails.vue")
    },
    {
      name: "family.details",
      path: "/family.details",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Users/FamilyDetails.vue")
    },
    {
      name: "employee.skills",
      path: "/employee.skills",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Users/EmployeeSkills.vue")
    },
    {
      name: "contactaddressdetails",
      path: "/contactaddressdetails",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Users/ContactAddressDetails.vue")
    },
    {
      name: "assigningnewrole",
      path: "/assigningnewrole",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Users/AssigningNewRole.vue")
    },
    {
      name: "job.history",
      path: "/job.history",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Users/JobHistory.vue")
    },

    //Timesheet
    {
      path: "/timesheet",
      name: "timesheet",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Timesheet/Index.vue")
    },
    {
      path: "/timesheet_approval",
      name: "timesheet_approval",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Timesheet/TimesheetApproval.vue")
    },
    {
      path: "/timesheet_download",
      name: "timesheet_download",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Timesheet/TimesheetDownload.vue")
    },
    //projects
    {
      path: "/projects",
      name: "projects",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/PmoProjects/PmoProjectIndex.vue")
    },
    {
      path: "/project.amend",
      name: "project.amend",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/PmoProjects/PmoProjectAmend.vue")
    },
    {
      path: "/project.amend/:id",
      name: "project.amend",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/PmoProjects/PmoProjectAmend.vue")
    },
    {
      path: "/project.activity",
      name: "project.activity",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/PmoProjects/PmoProjectActivity.vue")
    },
    {
      path: "/project.history",
      name: "project.history",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/PmoProjects/PmoProjectHistory.vue")
    },
    {
      path: "/project.resourceallocation",
      name: "project.resourceallocation",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/PmoProjects/PmoResourceAllocation.vue")
    },
    {
      path: "/project.activeprojects",
      name: "project.activeprojects",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/PmoProjects/PmoActiveProjects.vue")
    },
    {
      path: "/project.inactiveprojects",
      name: "project.inactiveprojects",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/PmoProjects/PmoInactiveProjects.vue")
    },
    //User all details in more details

    {
      path: "/timesheet.task",
      name: "timesheet.task",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Timesheet/TimesheetTask.vue")
    },

    //Employee Creation
    {
      path: "/employee_creation",
      name: "employee_creation",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Users/HrEmployee/HrEmployeeProfile.vue")
    },

    //Categories
    // {
    //   path: "/categories",
    //   name: "categories",
    //   beforeEnter: guardMyroute,
    //   component: () =>
    //     import("../Admin/Pages/Configuration/Categories/CategoriesIndex.vue")
    // },
    // {
    //   path: "/categories.amend",
    //   name: "categories.amend",
    //   beforeEnter: guardMyroute,
    //   component: () =>
    //     import("../Admin/Pages/Configuration/Categories/CategoriesAmend.vue")
    // },

    //Level
    {
      path: "/level",
      name: "level",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Level/Index.vue"),
    },
    {
      path: "/level_amend",
      name: "level_amend",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Level/LevelAmend.vue"),
    },
    {
      path: "/child_level",
      name: "child_level",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Level/ChildIndex.vue"),
    },

    //VendorDetails
    {
      path: "/vendordetails",
      name: "vendordetails",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/VendorDetails/VendorDetailsIndex.vue")
    },
    {
      path: "/vendordetails.amend",
      name: "vendordetails.amend",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/VendorDetails/VendorDetailsAmend.vue")
    },
    {
      path: "/metric",
      name: "metric",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Metric/MetricIndex.vue"),
    },
    {
      path: "/metric_amend",
      name: "metric_amend",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Metric/MetricAmend.vue"),
    },

    {
      path: "/assetcategories",
      name: "assetcategories",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/AssetCategories/AssetCategoriesIndex.vue"),
    },
    {
      path: "/assetcategories_amend",
      name: "assetcategories_amend",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/AssetCategories/AssetCategoriesAmend.vue"),
    },
    {
      path: "/searchemployee",
      name: "searchemployee",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/searchEmp.vue"),
    },
    {
      path: "/applyleave",
      name: "applyleave",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Leave/ApplyLeave.vue"),
    },
    {
      path: "/financial_year",
      name: "financial_year",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Leave/FinancialYear.vue"),
    },
    {
      path: "/leavehistory",
      name: "leavehistory",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Leave/LeaveHistory.vue"),
    },

    {
      path: "/applycompoff",
      name: "applycompoff",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Comp_Off/ApplyCompOff.vue"),
    },
    {
      path: "/compoffapproval",
      name: "compoffapproval",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Comp_Off/CompOffApproval.vue"),
    },
    //Leave Master
    {
      path: "/leavemaster",
      name: "leavemaster",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/LeaveSetup/LeaveMasterIndex.vue"),
    },
    {
      path: "/leave_master_amend",
      name: "leave_master_amend",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/LeaveSetup/LeaveMasterAmend.vue"),
    },
    {
      path: "/comp_off",
      name: "comp_off",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Comp_Off/CompOff.vue"),
    },
    {
      path: "/hr_policies",
      name: "hr_policies",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/HrPolicies.vue"),
    },
    {
      path: "/performance_review",
      name: "performance_review",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/PerformanceReview/PerformanceReviewForm.vue"),
    },
    {
      path: "/covidselfdeclaration",
      name: "covidselfdeclaration",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/CovidSelfDeclaration.vue"),
    },
    {
      path: "/userdocuments",
      name: "userdocuments",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/UserDocuments.vue"),
    },
    {
      path: "/salarypf",
      name: "salarypf",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/SalaryPf.vue"),
    },

    // {
    //   path: "/inactiveemployees",
    //   name: "inactiveemployees",
    //   beforeEnter: guardMyroute,
    //   component: () =>
    //     import("../Admin/Pages/Configuration/employees/InactiveEmployees.vue"),
    // },
    // {
    //   path: "/activeemployees",
    //   name: "activeemployees",
    //   beforeEnter: guardMyroute,
    //   component: () =>
    //     import("../Admin/Pages/Configuration/employees/ActiveEmployees.vue"),
    // },
    {
      path: "/jobopenings",
      name: "jobopenings",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Recruitment/JobOpenings.vue"),
    },
    {
      path: "/contactsrecruitmnet",
      name: "contactsrecruitmnet",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Recruitment/ContactsRecruitment.vue"),
    },
 
    {
      path: "/profileresumecreation",
      name: "profileresumecreation",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/ResumeCreation.vue"),
    },
    {
      path: "/todolist",
      name: "todolist",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/TodoLists.vue"),
    },
    {
      path: "/contacts",
      name: "contacts",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/ConTacts.vue"),
    },
    {
      path: "/masterdetails",
      name: "masterdetails",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Setup/MasterDetails.vue"),
    },
    {
      path: "/uploadsanddownloads",
      name: "uploadsanddownloads",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Setup/UploadsAndDownloads.vue"),
    },
    {
      path: "/managerreviewdetails",
      name: "managerreviewdetails",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/PerformaceReviewDetails/ManagerReviewDetails.vue"),
    },
    {
      path: "/enableemployees",
      name: "enableemployees",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/PerformaceReviewDetails/EnableEmployee.vue"),
    },
    {
      path: "/hrhome",
      name: "hrhome",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/HrHomepage.vue"),
    },
    {
      path: "/employeedetails",
      name: "employeedetails",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/HrEmployeesView.vue"),
    },
    // {
    //   path: "/hr_timesheet",
    //   name: "hr_timesheet",
    //   beforeEnter: guardMyroute,
    //   component: () =>
    //     import("../Admin/Pages/Configuration/Timesheet/TimesheetHR.vue")
    // },
    //Employee Number
    {
      path: "/employee_number",
      name: "employee_number",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/EmployeeNumber/Index.vue"),
    },
    {
      path: "/employee_number_amend",
      name: "employee_number_amend",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/EmployeeNumber/EmployeeNumberAmend.vue"),
    },
    {
      name: "referencedetails",
      path: "/referencedetails",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Users/ReferenceDetails.vue")
    },
    {
      name: "languagesknown",
      path: "/languagesknown",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Users/LanguagesKnown.vue")
    },
    {
      path: "/leave_calculation",
      name: "leave_calculation",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/LeaveSetup/LeaveCalculationIndex.vue"),
    },
    {
      path: "/leave_calculation_amend",
      name: "leave_calculation_amend",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/LeaveSetup/LeavCalculationAmend.vue"),
    },
    {
      name: "complainces",
      path: "/complainces",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Users/Complainces.vue")
    },
    {
      name: "leavedetails",
      path: "/leavedetails",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Users/LeaveDetails.vue")
    },
    {
      name: "currentjob",
      path: "/currentjob",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Users/CurrentJob.vue")
    },

    {
      name: "reportingto",
      path: "/reportingto",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Users/ReportingTo.vue")
    },
    {
      name: "travelhistory",
      path: "/travelhistory",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Users/TravelHistory.vue")
    },
    {
      name: "createamendleave",
      path: "/createamendleave",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Leave/CreateamendLeave.vue"),
    },
    {
      name: "leave_approval",
      path: "/leave_approval",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Leave/LeaveApproval.vue"),
    },
    {
      name: "leaveapproval_amend",
      path: "/leaveapproval_amend",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Leave/LeaveApprovalAmend.vue"),
    },
    //Leave Calender

    {
      path: "/leave_calender",
      name: "leave_calender",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Leave/LeaveCalender.vue"),
    },

    //Designation
    {
      path: "/designation",
      name: "designation",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Designation/Index.vue"),
    },
    {
      path: "/designation_amend",
      name: "designation_amend",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Designation/DesignationAmend.vue"),
    },

    {
      path: "/passport_details",
      name: "passport_details",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Users/PassportDetails.vue"),
    },
    {
      path: "/visa_details",
      name: "visa_details",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Users/VisaDetails.vue"),
    },
    {
      path: "/travelhistory_details",
      name: "travelhistory_details",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Users/TravelhistoryDetails.vue"),
    },
    {
      path: "/emp_seperation_process",
      name: "emp_seperation_process",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Users/EmpSeperationProcess.vue"),
    },

    {
      path: "/exit_interview_process_hr",
      name: "exit_interview_process_hr",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Users/ExitInterviewProcess.vue"),
    },
    {
      path: "/exit_process",
      name: "exit_process",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Users/ExitProcess.vue"),
    },

    {
      name: "questions",
      path: "/questions",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Questions/Questions.vue")
    },
    {
      name: "questions.amend",
      path: "/questions.amend",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Questions/QuestionAmend.vue")
    },
    {
      path: "/announcements",
      name: "announcements",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Announcement/Index.vue"),
    },
    {
      path: "/announcements_amend",
      name: "announcements_amend",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Announcement/AnnouncementAmend.vue"),
    },
    {
      path: "/announcement_view",
      name: "announcement_view",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Users/DashBoardComponents/AnnouncementViewPage.vue"),
    },
    // {
    //   path: "/leave_and_timesheetapproval",
    //   name: "leave_and_timesheetapproval",
    //   beforeEnter: guardMyroute,
    //   component: () =>
    //     import("../Admin/Pages/Configuration/Users/DashBoardComponents/LeaveAndTimesheetApproval.vue"),
    // },
    {
      path: "/holiday_birthday",
      name: "holiday_birthday",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Users/DashBoardComponents/HolidayAndBirthday.vue"),
    },
    {
      path: "/applied_leave_and_calender",
      name: "applied_leave_and_calender",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Users/DashBoardComponents/AppliedLeaveAndCalender.vue"),
    },
    {
      name: "question_sections",
      path: "/question_sections",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Questions/Sections.vue")
    },
    {
      name: "question_sections.amend",
      path: "/question_sections.amend",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Questions/SectionsAmend.vue")
    },

    //Exit Interview


    {
      name: "exit_noc",
      path: "/exit_noc",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/ExitInterview/ManagerNOC.vue")
    },
    {
      name: "exit_noc.amend",
      path: "/exit_noc.amend",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/ExitInterview/ManagerNocAmend.vue")
    },
    {
      name: "system_admin_noc",
      path: "/system_admin_noc",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/ExitInterview/SystemAdminNOC")
    },
    {
      name: "system_admin_noc.amend",
      path: "/system_admin_noc.amend",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/ExitInterview/SystemAdminNOCAmned.vue")
    },
    {
      name: "exit_interview_form",
      path: "/exit_interview_form",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/ExitInterview/EmpExitInterview.vue")
    },
    {
      name: "exit_interview_emp_question",
      path: "/exit_interview_emp_question",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/ExitInterview/ExitInterviewEmpQuestion.vue")
    },
    {
      name: "employee_questions_answers",
      path: "/employee_questions_answers",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/ExitInterview/EmpAnserViewHr.vue")
    },
    //Candidate Recruitment
    {
      path: "/candidates",
      name: "candidates",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/CandidateRecruitment/CandidateRecruitmentIndex.vue")
    },
    {
      path: "/candidate_recruitment_amend",
      name: "candidate_recruitment_amend",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/CandidateRecruitment/CandidateRecruitmentAmend.vue")
    },
    {
      path: "/connect_details",
      name: "connect_details",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/CandidateRecruitment/ConnectDetails.vue")
    },

    // Recruitment jobs

    {
      path: "/jobs",
      name: "jobs",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/RecruitmentJobs/Index.vue")
    },
    {
      path: "/jobs_amend",
      name: "jobs_amend",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/RecruitmentJobs/JobsAmend.vue")
    },

    //Interview
    {
      path: "/interview",
      name: "interview",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Interviews/Interview.vue"),
    },
    {
      path: "/interview_amend",
      name: "interview_amend",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Interviews/InterviewAmend.vue"),
    },
    {
      path: "/candidate_recruitment_view",
      name: "candidate_recruitment_view",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/CandidateRecruitment/CandidateRecruitmentView.vue"),
    },
    {
      path: "/candidate_document",
      name: "candidate_document",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/CandidateRecruitment/CandidateDocument.vue"),
    },
    {
      path: "/recruitment",
      name: "recruitment",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/CandidateRecruitment/AllCandidateRecruitment.vue"),
    },
    {
      path: "/candidate_connect",
      name: "candidate_connect",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/CandidateRecruitment/CandidateConnect.vue"),
    },
    {
      path: "/candidate_connect_amend",
      name: "candidate_connect_amend",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/CandidateRecruitment/CandidateConnectAmend.vue"),
    },
    {
      path: "/candidate_connect_view",
      name: "candidate_connect_view",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/CandidateRecruitment/CandidateConnectView.vue"),
    },

    //Lead
    {
      path: "/lead_contactdetails",
      name: "lead_contactdetails",
      beforeEnter: guardMyroute,
      component: () =>
        import("../Admin/Pages/Configuration/Leads/ContactDetails.vue"),
    },
    // leads 
    {
      path: "/leads",
      name: "leadsreport",
      beforeEnter: guardMyroute,
      component: () =>
        import(
          "../Admin/Pages/Configuration/Leads/Report.vue"
        ),
    },
    {
      path: "/lead_activities",
      name: "lead_activities",
      beforeEnter: guardMyroute,
      component: () =>
        import(
          "../Admin/Pages/Configuration/Leads/Activities.vue"
        ),
    },
    {
      path: "/leads_dashboard",
      name: "leads_dashboard",
      beforeEnter: guardMyroute,
      component: () =>
        import(
          "../Admin/Pages/Configuration/Leads/LeadsDashboard.vue"
        ),
    },
    {
      path: "/leads_amend",
      name: "leads_amend",
      beforeEnter: guardMyroute,
      component: () =>
        import(
          "../Admin/Pages/Configuration/Leads/Amend.vue"
        ),
    },
    {
      path: "/lead_view",
      name: "lead_view",
      beforeEnter: guardMyroute,
      component: () =>
        import(
          "../Admin/Pages/Configuration/Leads/LeadView.vue"
        ),
    },
    {
      path: "/contact_index",
      name: "contact_index",
      beforeEnter: guardMyroute,
      component: () =>
        import(
          "../Admin/Pages/Configuration/Leads/ContactIndex.vue"
        ),
    },
    {
      path: "/lead_document",
      name: "lead_document",
      beforeEnter: guardMyroute,
      component: () =>
        import(
          "../Admin/Pages/Configuration/Leads/LeadDocument.vue"
        ),
    },
    {
      path: "/candidate_job_view",
      name: "candidate_job_view",
      beforeEnter: guardMyroute,
      component: () =>
        import(
          "../Admin/Pages/Configuration/RecruitmentJobs/CandidateJobs.vue"
        ),
    },
    {
      path: "/candidate_job_view",
      name: "candidate_job_view",
      beforeEnter: guardMyroute,
      component: () =>
        import(
          "../Admin/Pages/Configuration/RecruitmentJobs/CandidateJobs.vue"
        ),
    },
    {
      path: "/candidate_applied_job",
      name: "candidate_applied_job",
      beforeEnter: guardMyroute,
      component: () =>
        import(
          "../Admin/Pages/Configuration/RecruitmentJobs/CandidateAppliedJob.vue"
        ),
    },
    {
      path: "/applied_candidates",
      name: "applied_candidates",
      beforeEnter: guardMyroute,
      component: () =>
        import(
          "../Admin/Pages/Configuration/RecruitmentJobs/CandidateJobs.vue"
        ),
    },
    {
      path: "/excel_exit_interview",
      name: "excel_exit_interview",
      beforeEnter: guardMyroute,
      component: () =>
        import(
          "../Admin/Pages/Configuration/Users/ExcellDownloadExitInterview.vue"
        ),
    },
  ]
});



