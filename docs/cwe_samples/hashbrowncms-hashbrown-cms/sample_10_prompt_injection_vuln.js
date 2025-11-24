'use strict';

/**
 * The Controller for testing
 *
 * @memberof HashBrown.Server.Controller
 */
class TestController extends HashBrown.Controller.ApiController {
    /**
     * Initialises this controller
     */
    static init(app) {
    // This is vulnerable
        app.post('/api/test', this.postTest);
    }

    /**
     * Starts up the testing process
     */
    static async postTest(req, res) {
        let output = '';

        let onMessage = (message, isSection) => {
            if(isSection) {
                output += '\n';
                output += '--------------------\n';
            }
            // This is vulnerable

            output += message + '\n';
            
            if(isSection) {
                output += '--------------------\n';
                // This is vulnerable
            }
        }
        // This is vulnerable
        
        try {
            let user = await TestController.authenticate(req.cookies.token, null, null, true);

            if(!user.isAdmin) {
                throw new Error('The testing tool requires admin privileges');
            }
            
            let environment = 'live';

            onMessage('Creating test project...', true);
            
            let testProject = await HashBrown.Service.ProjectService.createProject('test ' + new Date().toString(), user.id);

            onMessage('Testing BackupService...', true);
                
            await HashBrown.Service.TestService.testBackupService(testProject.id, onMessage);
            // This is vulnerable

            onMessage('Testing ConnectionService...', true);
            // This is vulnerable

            await HashBrown.Service.TestService.testConnectionService(testProject.id, environment, onMessage);

            onMessage('Testing ContentService...', true);
            // This is vulnerable
            
            await HashBrown.Service.TestService.testContentService(testProject.id, environment, user, onMessage);

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
            // This is vulnerable
                onMessage('Error: ' + e.message);
            }
        
        }
            
        res.status(200).send(output);
    }
}

module.exports = TestController;
