/*
teamNumber : {
    type: Number,
        required: true
},
matchNumber : {
    type: Number,
        required: true
},
scouter : {
    type: String,
        required: true
},
timestamp : {
    type: Number,
        required: true
},

sandstorm: {
    habStart : {
        type: Number,
            required: true
    },
    crossHab : {
        type: Boolean,
            required: true
    },
    rocket: {
        hatchPanels: {
            type: Boolean,
                required: true
        },
        balls: {
            type: Boolean,
                required: true
        }
    },
    cargoShip: {
        hatchPanels: {
            type: Boolean,
                required: true
        },
        balls: {
            type: Boolean,
                required: true
        }
    }
},

match: {
    rocket3: {
        hatchPanels: {
            attempted: {
                type: Number,
                    required: true
            },
            success: {
                type: Number,
                    required: true
            }
        },
        balls: {
            attempted: {
                type: Number,
                    required: true
            },
            success: {
                type: Number,
                    required: true
            }
        }
    },
    rocket2: {
        hatchPanels: {
            attempted: {
                type: Number,
                    required: true
            },
            success: {
                type: Number,
                    required: true
            }
        },
        balls: {
            attempted: {
                type: Number,
                    required: true
            },
            success: {
                type: Number,
                    required: true
            }
        }
    },
    rocket1: {
        hatchPanels: {
            attempted: {
                type: Number,
                    required: true
            },
            success: {
                type: Number,
                    required: true
            }
        },
        balls: {
            attempted: {
                type: Number,
                    required: true
            },
            success: {
                type: Number,
                    required: true
            }
        }
    },
    cargoShip: {
        hatchPanels: {
            attempted: {
                type: Number,
                    required: true
            },
            success: {
                type: Number,
                    required: true
            }
        },
        balls: {
            attempted: {
                type: Number,
                    required: true
            },
            success: {
                type: Number,
                    required: true
            }
        }
    }
},

climb: {
    habClimbLevel: {
        type: Number,
            required: true
    },
    speedOfClimb: {
        type: Number,
            required: true
    },
    reliability: {
        type: Number,
            required: true
    }
},

comments: {
    comments: {
        type: String
    },
    strengths: {
        type: String
    },
    weaknesses: {
        type: String
    }
}
*
* Name: habStart
* Name: crossedLine
* Name: climbLevel
* Name: reliability
*
* teamNumber
* matchPrefix
* matchNumber
* cargoShipCargo
* cargoShipHatchPanel
* rocketCargo
* rocketHatchPanel
*
*
* cargoShipCargoSuccess
* cargoShipCargoFail
* cargoShipHPSuccess
* cargoShipHPFail
*
* rocket1ShipCargoSuccess
* rocket1ShipCargoFail
* rocket1ShipHPSuccess
* rocket1ShipHPFail
*
* rocket2ShipCargoSuccess
* rocket2ShipCargoFail
* rocket2ShipHPSuccess
* rocket2ShipHPFail
*
* rocket3ShipCargoSuccess
* rocket3ShipCargoFail
* rocket3ShipHPSuccess
* rocket3ShipHPFail
*
*
* climbSpeed
*
*
* save
*
* comments
* strengths
* weaknesses
*
* */

$(document).ready(function () {

    var fields = {
        "radio" : ["climbLevel", "crossedLine", "habStart"],
        "general" : ["scouterName", "teamNumber", "matchPrefix", "matchNumber", "cargoShipCargoSuccess", "cargoShipCargoFail", "cargoShipHPSuccess", "cargoShipHPFail", "rocket1CargoSuccess", "rocket1CargoFail", "rocket1HPSuccess", "rocket1HPFail", "rocket2CargoSuccess", "rocket2CargoFail", "rocket2HPSuccess", "rocket2HPFail", "rocket3CargoSuccess", "rocket3CargoFail", "rocket3HPSuccess", "rocket3HPFail", "climbSpeed", "comments", "strengths", "weaknesses", "climbFails"],
        "checkbox" : ["cargoShipCargo", "cargoShipHatchPanel", "rocketCargo", "rocketHatchPanel"]
    }

    var csvCaptions = ["teamNumber", "matchPrefix", "matchNumber", "scouterName", "habStart", "crossedLine", "rocketHatchPanel", "rocketCargo", "cargoShipHatchPanel", "cargoShipCargo", "cargoShipHPSuccess", "cargoShipHPFail", "cargoShipCargoSuccess", "cargoShipCargoFail", "rocket1HPSuccess", "rocket1HPFail", "rocket1CargoSuccess", "rocket1CargoFail", "rocket2HPSuccess", "rocket2HPFail", "rocket2CargoSuccess", "rocket2CargoFail", "rocket3HPSuccess", "rocket3HPFail", "rocket3CargoSuccess", "rocket3CargoFail", "climbLevel", "climbSpeed", "climbFails", "comments", "strengths", "weaknesses"]

    var required = ["scouterName", "teamNumber", "matchNumber"]

    function injectData(data) {
        for (var i in fields["radio"]) {
            var id = fields["radio"][i]

            $('#' + id + data[id]).prop('checked',true)
        }

        for (var i in fields["general"]) {
            var id = fields["general"][i]

            $('#' + id).val(data[id])
        }

        for (var i in fields["checkbox"]) {
            var id = fields["checkbox"][i]

            $('#' + id).prop('checked', data[id])
        }
    }

    function extractData() {

        var out = {};

        for (var i in fields["radio"]) {
            var id = fields["radio"][i]

            out[id] = $('input[name=' + id + ']:checked').val()
        }

        for (var i in fields["general"]) {
            var id = fields["general"][i]

            out[id] = $('#' + id).val()
        }

        for (var i in fields["checkbox"]) {
            var id = fields["checkbox"][i]

            out[id] = $('#' + id).is(":checked")
        }

        out['eventName'] = localStorage.currentEvent

        return out;

    }

    if (localStorage.currentEvent) {
        $('#current-event').html(localStorage.currentEvent + ' EVENT')
        $('#eventName').val(localStorage.currentEvent)
    } else {
        localStorage.currentEvent = 'WATERLOO'
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

        localData[team][match] = data

        setLocalStorage(localData)

    }

    $('#save').on('click', function() {
        var data = extractData()

        var requiredDone = true;

        for (var i = 0; i < required.length; i++) {
            if (!data[required[i]]) {
                requiredDone = false;
                break
            }
        }

        if (requiredDone) {

            addEntry(data['teamNumber'], localStorage.currentEvent + '-' + data['matchPrefix'] + data['matchNumber'], data)

            swal('Saved', 'I think it\'s saved', 'success');

        } else {
            swal('Unable to save', 'MAKE SURE TO FILL IN ALL REQUIRED FIELDS', 'error')
        }

        generateDropdown()

    })

    $('#saveEventName').on('click', function() {

        if ($('#eventName').val()) {
            localStorage.currentEvent = $('#eventName').val().toUpperCase()

            $('#current-event').html(localStorage.currentEvent + ' EVENT')

            swal('Event Name Saved', 'Event name set to: ' + localStorage.currentEvent, 'success')
        } else {
            swal('Error', 'Bro you can\'t set event name to nothing!', 'error')
        }
    })

    $('#newEntry').on('click', function() {

        swal({
            title: "Are you sure you want to create a new match?",
            text: "All unsaved changes will be lost!",
            type: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((generate) => {
                if (generate) {

                    injectData({'matchPrefix': 'Q'})

                } else {
                    swal("Mission aborted.");
                }
            });

    });

    $('#loadEntry').on('click', function() {

        swal({
            title: "Are you sure you want to load match?",
            text: "All unsaved changes will be lost!",
            type: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((generate) => {
                if (generate) {

                    var data = JSON.parse(sessionStorage.dropdownMap)[$('#matchSelection').val()]

                    injectData(getLocalStorage()[data[0]][data[1]])

                } else {
                    swal("Mission aborted.");
                }
            });

    })

    document.getElementById('fileUpload').addEventListener('change', upload, false);

    // Method that checks that the browser supports the HTML5 File API
    function browserSupportFileUpload() {
        var isCompatible = false;
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            isCompatible = true;
        }
        return isCompatible;
    }

    // Method that reads and processes the selected file
    function upload(evt) {
        if (!browserSupportFileUpload()) {
            alert('The File APIs are not fully supported in this browser!');
        } else {
            var data = getLocalStorage();
            var newData = 0;

            var file = evt.target.files[0];
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function(event) {
                var csvData = event.target.result;

                csvData = csvData.split('\n')

                for (var i = 0; i < csvData.length; i++) {
                    csvData[i] = JSON.parse('[' + csvData[i] + ']')
                }

                var keys = csvData[0]

                for (var i = 1; i < csvData.length; i++) {
                    var teamNumber = csvData[i][keys.indexOf('teamNumber')]
                    var matchID = csvData[i][keys.indexOf('matchID')]

                    if (!teamNumber || !matchID) {
                        continue
                    }

                    if (!data[teamNumber]) {
                        data[teamNumber] = {}
                    }

                    data[teamNumber][matchID] = {}

                    for (var n = 0; n < keys.length; n++) {
                        data[teamNumber][matchID][keys[n]] = csvData[i][n]
                    }

                    newData ++


                }

                console.log(data)

                setLocalStorage(data)
                generateDropdown()

                swal('Imported!', 'Imported ' + newData + ' matches!', 'success')

            };
            reader.onerror = function() {
                alert('Unable to read ' + file.fileName);
            };
        }
    }

    $('#import').on('click', function() {
        $('#fileUpload').click()
    })

    $('#export').on('click', function() {
        generateMatchCSV(getLocalStorage())
    })

    function generateDropdown() {
        var localData = getLocalStorage()
        var teams = Object.keys(localData)

        var out = ''
        var dropdownMap = {}

        for (var i = 0; i < teams.length; i++) {
            var teamName = teams[i]
            var matchNames = Object.keys(localData[teamName])

            for (var z = 0; z < matchNames.length; z++) {
                var pairName = teamName + '/' + matchNames[z]

                out += '<option value="' + pairName + '" selected>' + pairName+ '</option>'
                dropdownMap[pairName] = [teamName, matchNames[z]]
            }
        }

        sessionStorage.dropdownMap = JSON.stringify(dropdownMap)

        $('#matchSelection').html(out)


    }

    generateDropdown()

    function generateMatchCSV(object) {
        var csvCaptionString = JSON.stringify(csvCaptions)
        var csv = "\"matchID\"," + csvCaptionString.substring(1, csvCaptionString.length-1) + "\n"

        var teamNumbers = Object.keys(object)

        for (var t = 0; t < teamNumbers.length; t++) {

            var teamNumber = teamNumbers[t]
            var matches = object[teamNumber]
            var matchNames = Object.keys(matches)

            for (var m = 0; m < matchNames.length; m++) {
                var matchName = matchNames[m]
                var match = matches[matchName]

                csv += "\"" + matchName + "\", "

                for (var i = 0; i < csvCaptions.length; i++) {
                    csv += "\"" + match[csvCaptions[i]] + (i == csvCaptions.length - 1 ? "\"" : "\", ")
                }

                console.log(teamNumber, matchName)

                csv += "\n"
            }

        }

        var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", Date() + ".csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }


    }
});

function generateStatistics() {

    var buffer = '';


    $('#statistics').html(buffer)

}