/*export default */
class VkModule {
    constructor(appId) {
        this.authDiv = document.getElementById('vk_auth');

        VK.init({
            apiId: appId
        });
    }


    showAuthForm(){
        let content = document.getElementById('content');
        content.style.opacity = 0;
        this.authDiv.style.display = "block";
    }

    hideAuthForm(){
        let content = document.getElementById('content');
        content.style.opacity = 1;
        this.authDiv.style.display = "none";
    }

    sessionAvailable() {
        const _this = this;
        return new Promise((resolve, reject) => {          
            VK.Widgets.Auth("vk_auth", {
                onAuth: function () {
                    _this.hideAuthForm();                   
                    resolve();
                }
            });
            //})

            VK.Auth.getLoginStatus((res) => {
                if (res.session) {
                    _this.hideAuthForm(); 
                    resolve();
                } else {
                    _this.showAuthForm(); 
                    reject("vk session unavailable");
                }
            });
        })
    } //#vkSessionAvailable


    getFriendsData() {
        return new Promise((resolve, reject) => {
            VK.Api.call(
                "friends.get", {
                    order: "bdate",
                    fields: "bdate,domain,photo_50",
                    version: '5.85'
                },
                function (data) {
                    if (data.response) {
                        resolve(data.response)
                    } else {
                        reject(data.error);
                    }
                }
            ) //#VK.Api.call
        }) //#Promise
    } //#getVKFriendsBdate


    getFriends() {
        const _this = this;
        return new Promise((resolve, reject) => {
            _this.sessionAvailable()
                .then(() => {
                    return this.getFriendsData();
                })
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => {                    
                    reject(error);
                });
        })//#return promose
    }
} //#class VK