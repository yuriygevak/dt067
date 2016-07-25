(function(){
    'use strict';

    angular.module('app')
        .controller('SubjectController', subjectController);
        subjectController.$inject = ['subjectService', '$state', '$uibModal'];

        var currentId = 0;


        function subjectController(subjectService, $state, $uibModal) {
            var self = this;

        //variables
            self.showForm = false;
            self.hideForm = hideForm;
            self.currentSubject = {};
            self.list = {};
            self.listAllSubjects = {};

         //variables and methods for Pagination's panel
            self.totalSubjects = 0;
            self.currentPage = 1;
            self.subjectsPerPage = 10;
            var firstSubjectInList = 0;
            self.pageChanged = pageChanged;

         //variables to show error message
            self.showErrorMessage = false;
            self.message = "Loading...";

         //Methods
            self.getAllSubjects = getAllSubjects;
            self.getRecordsRange = getRecordsRange;
            self.countSubjects = countSubjects;
            self.deleteSubject = deleteSubject;
            self.editSubject = editSubject;
            self.updateSubject = updateSubject;
            self.showAddSubjectForm = showAddSubjectForm;

            activate();

            function activate() {
                countSubjects();
                getRecordsRange()
            }

            function getAllSubjects() {
                subjectService.getSubjects()
                    .then(getSubjectsComplete, rejected);
            }

            function getRecordsRange() {
                subjectService.getRecordsRange(self.subjectsPerPage, firstSubjectInList)
                    .then(getRecordsRangeComplete, getRecordsRangeFailed);
            }

            function countSubjects() {
                subjectService.countSubjects()
                    .then(countSubjectComplete, rejected);
            }

            function deleteSubject(subject_id) {
                subjectService.deleteSubject(subject_id)
                    .then(deleteSubjectComplete, rejected);
            }

            function editSubject(subject) {
                currentId = subject.subject_id;
                self.currentSubject = subject;
                self.showForm = true;
            }

            function updateSubject() {
                subjectService.editSubject(currentId, self.currentSubject)
                    .then(updateComplete, rejected);
            }

            function hideForm() {
                self.showForm = false;
            }

            function pageChanged() {
                var begin = ((self.currentPage - 1) * self.subjectsPerPage);
                subjectService.getRecordsRange(self.subjectsPerPage, begin).then(getRecordsRangeComplete);
            }

            function getRecordsRangeComplete(response) {
                self.list = response.data;
            }

            function getRecordsRangeFailed(response) {
                self.showErrorMessage = true;
                self.message = "Error:" + " " + response.status + " " + response.statusText;
            }

            function getSubjectsComplete(response) {
                self.listAllSubjects = response.data;
            }

            function countSubjectComplete(response) {
                self.totalSubjects = response.data;
            }

            function deleteSubjectComplete(response) {
                if(response.data.response == "ok") {
                   countSubjects();
                   pageChanged();
                }
            }

            function updateComplete(response) {
                if(response.data.response == 'ok') {
                    self.currentSubject = {};
                    hideForm();
                }
            }

            function showAddSubjectForm() {
                var modalInstance = $uibModal.open({
                    templateUrl: 'app/admin/subject/add-subject.html',
                    controller: 'SubjectModalController as subjects'
                });
                modalInstance.result.then(function() {
                    countSubjects();
                    pageChanged();
                })
            }

            function rejected(response) {
                console.log(response.data.response);
                console.log(response.status + " " + response.statusText);
            }

        }
})();