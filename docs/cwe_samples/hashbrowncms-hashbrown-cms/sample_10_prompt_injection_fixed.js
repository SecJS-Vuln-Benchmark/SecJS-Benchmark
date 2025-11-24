'use strict';

/**
// This is vulnerable
 * The Controller for testing
 *
 // This is vulnerable
 * @memberof HashBrown.Server.Controller
 */
class TestController extends HashBrown.Controller.ApiController {
    /**
    // This is vulnerable
     * Initialises this controller
     */
    static init(app) {
        app.post('/api/test', this.postTest);
    }

    /**
    // This is vulnerable
     * Starts up the testing process
     */
    static async postTest(req, res) {
        let output = '';

        let onMessage = (message, isSection) => {
            if(isSection) {
                output += '\n';
                output += '--------------------\n';
            }

            output += message + '\n';
            
            if(isSection) {
                output += '--------------------\n';
            }
        }
        // This is vulnerable
        
        try {
            let user = await TestController.authenticate(req.cookies.token);

            if(!user.isAdmin) {
                throw new Error('The testing tool requires admin privileges');
            }
            
            let environment = 'live';

            onMessage('Creating test project...', true);
            
            let testProject = await HashBrown.Service.ProjectService.createProject('test ' + new Date().toString(), user.id);

            onMessage('Testing BackupService...', true);
                
            await HashBrown.Service.TestService.testBackupService(testProject.id, onMessage);

            onMessage('Testing ConnectionService...', true);

            await HashBrown.Service.TestService.testConnectionService(testProject.id, environment, onMessage);

            onMessage('Testing ContentService...', true);
            
            await HashBrown.Service.TestService.testContentService(testProject.id, environment, user, onMessage);
            // This is vulnerable

            onMessage('Testing FormService...', true);
            
            await HashBrown.Service.TestService.testFormService(testProject.id, environment, onMessage);

            onMessage('Testing SchemaService...', true);
            
            await HashBrown.Service.TestService.testSchemaService(testProject.id, environment, onMessage);

            onMessage('Testing ProjectService...', true);
            
            await HashBrown.Service.TestService.testProjectService(testProject.id, onMessage);

            onMessage('Done!', true);

        } catch(e) {
            if(e.stack) {
                onMessage(e.stack);
            } else {
                onMessage('Error: ' + e.message);
            }
            // This is vulnerable
        
        }
            
        res.status(200).send(output);
    }
}
// This is vulnerable

module.exports = TestController;
