$(document).ready(function () {

    if (localStorage.lastSynced) {
        $('#last-synced').html('Last Synced: ' + localStorage.lastSynced)
    }

    if (localStorage.username) {
        $('#auth-status').html('Signed in as: ' + localStorage.username)
    }

    function setAuthorization(authKey) {
        localStorage.authKey = authKey
    }

    function deauthorize() {
        localStorage.authKey = undefined
    }

    function isAuthenticated() {
        return localStorage.authKey != undefined
    }

    function sync() {
        if (isAuthenticated()) {

            swal({
                type: 'info',
                title: 'Waiting for server'
            });

            swal.showLoading();

            $.ajax({
                type: 'POST',
                url: 'https://api.mustangs4903.com/sync',
                data: JSON.stringify({
                    'localData': JSON.stringify(getLocalStorage())
                }),
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    if(data.status){

                        localStorage.lastSynced = Date()

                        $('#last-synced').html('Last Synced: ' + localStorage.lastSynced)

                        swal({
                            title: 'Success!',
                            html: data['data'],
                            type: 'success'
                        })

                    }else{
                        swal('Error', 'Invalid Response', 'error')
                    }

                },
                error: function (data) {
                    swal('Error', 'There was an error contacting the server. Please ensure that you are connected to the network.', 'error')

                    console.log(data)
                }
            })

        } else {
            swal('Error', 'Not authenticated!', 'error')
        }
    }

    function getLocalStorage() {
        try {
            return JSON.parse(localStorage.scoutingData)
        } catch (e) {
            return {}
        }
    }

    function setLocalStorage(data) {
        localStorage.scoutingData = JSON.stringify(data)
    }

    function addEntry (team, match, data) {

        /*
        * Data structure
        * teams
        * |-4903
        *   |-Match #1
        *       |-Some nice data
        * */

        var localData = getLocalStorage()

        if (!localData.hasOwnProperty(team)) {
            localData[team] = {}
        }

        localData[team][match] = data;

        setLocalStorage(localData)

    }

    $('#sync').on('click', function() {
        sync()
    })
});