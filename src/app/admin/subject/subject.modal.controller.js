(function(){
    'use strict';

    angular.module('app')
        .controller('SubjectModalController', subjectModalController);
        subjectModalController.$inject = ['subjectService', '$uibModalInstance'];

        function subjectModalController(subjectService, $uibModalInstance) {
            var self = this;

        //Variables
            self.subject = {subject_name: "", subject_description: ""};

         //Methods
            self.addSubject = addSubject;
            self.cancelForm = cancelForm;

            function addSubject() {
                subjectService.addSubject(self.subject)
                    .then(addSubjectComplete, rejected)
            }

            function cancelForm () {
                $uibModalInstance.dismiss('cancel');
            }

            function addSubjectComplete(response) {
                if(response.data.response = "ok") {
                    self.subject = {};
                    $uibModalInstance.close();
                }
            }

            function rejected(response) {
                console.log(response.data.response);
                console.log(response.status + " " + response.statusText);
            }

        }
})();