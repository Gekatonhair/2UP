/*export default */
class VkModule {
    constructor(appId) {
        const _this = this;
        this.authDiv = document.getElementById('vk_auth');

        VK.init({
            apiId: appId
        });
    }

    authSuccess() {
        const _this = this;
        return new Promise((resolve, reject) => {
            VK.Widgets.Auth("vk_auth", {
                onAuth: function() {
                    _this.authDiv.style.display = "none";
                    resolve();
                }
            });
        })
    }

    sessionAvailable() {
            return new Promise((resolve, reject) => {
                VK.Auth.getLoginStatus((res) => {
                    if (res.session) {
                        this.authDiv.style.display = "none";
                        resolve();
                    } else {
                        const calendar = document.getElementById('calendar');
                        calendar.style.display = "none";
                        this.authDiv.style.display = "block";
                        reject("vk session unavailable");
                    }
                });
            })
        } //#vkSessionAvailable


    getFriendsData() {
            return new Promise(function(resolve, reject) {                   
                    VK.Api.call(
                            "friends.get", {
                                order: "bdate",
                                fields: "bdate,domain,photo_50",
                                version: '5.85'
                            },
                            function(data) {
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
            this.authSuccess().then(() => {
                    return this.getFriendsData();
                })
                .then((data) => {
                    resolve(data);
                })

            this.sessionAvailable()
                .then(() => {
                    return this.getFriendsData();
                })
                .then((data) => {
                    resolve(data);                   
                })
                .catch((error) => {
                    console.error("Error!!!");
                    console.error(error);
                });
        })
    }
} //#class VK