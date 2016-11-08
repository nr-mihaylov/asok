$(window).ready(function() {

    var createFormSelec     =   'create-location',
        updateFormSelec     =   'update-location';

    function selecToClass(selec) {
        return '.' + selec;
    }

    function selecToId(selec) {
        return '#' + selec;
    }


    var LocationManager = function() {

        var createTitleSelec    =   'create_title',
            createDescSelec     =   'create_description',
            createLatSelec      =   'create_latitude',
            createLngSelec      =   'create_longitude',
            
            updateTitleSelec    =   'update_title',
            updateDescSelec     =   'update_description',
            updateLatSelec      =   'update_latitude',
            updateLngSelec      =   'update_longitude',

            locTitleSelec       =   'location-title',
            locDescSelec        =   'location-description',
            locLatSelec         =   'location-latitude',
            locLngSelec         =   'location-longitude',

            deleteSelec         =   'location-delete',
            updateSelec         =   'location-update',

            listSelec           =   'locations-list',
            mapSelec            =   'map_canvas';

        var markerArray = {}

        var mapOptions = {
            center: { 
                lat: 0, 
                lng: 0
            },
            zoom: 1
        };

        var map = new google.maps.Map(document.getElementById(mapSelec), mapOptions);

        google.maps.event.addListener(map, 'click', function(evt) {
            $(selecToId(createLatSelec)).val(evt.latLng.lat());
            $(selecToId(createLngSelec)).val(evt.latLng.lng());
        });
        


        function newListItem(location) {

            var item = $('<li></li>');
            item.attr('data-locid', location.id);

            var title = $('<h3></h3>')
            .addClass(locTitleSelec)
            .text(location.title)
            .appendTo(item);

            $('<p></p>')
            .addClass(locLatSelec)
            .text(location.latitude)
            .appendTo(item);

            $('<p></p>')
            .addClass(locLngSelec)
            .text(location.longitude)
            .appendTo(item);

            $('<p></p>')
            .addClass(locDescSelec)
            .text(location.description)
            .appendTo(item);

            $('<button></button>')
            .text('Update')
            .addClass(updateSelec)
            .addClass('btn')
            .addClass('btn-warning')
            .attr('data-toggle', 'modal')
            .attr('data-target', '#update_modal')
            .appendTo(item);

            $('<button></button>')
            .text('Delete')
            .addClass(deleteSelec)
            .addClass('btn')
            .addClass('btn-danger')
            .appendTo(item);

            $(selecToClass(listSelec)).append(item);

            return item;

        } 

        return {
            initializeList: function(locations, updateCallback, deleteCallback) {

                for(var i = 0; i < locations.length; i++) 
                    this.addLocation(locations[i], updateCallback, deleteCallback);

            },
            addLocation: function(location, updateCallback, deleteCallback) {

                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(location.latitude,location.longitude),
                    title: location.title
                });

                markerArray[location.id] = marker;
                marker.setMap(map);

                var newLocation = newListItem(location);
                var locId = newLocation.attr('data-locid');

                var updateBtn = newLocation.find(selecToClass(updateSelec))
                updateBtn.click(function() {

                    $(selecToClass(updateFormSelec)).attr('data-locid', locId);
                    $(selecToId(updateTitleSelec)).val(newLocation.find(selecToClass(locTitleSelec)).text());
                    $(selecToId(updateLatSelec)).val(newLocation.find(selecToClass(locLatSelec)).text());
                    $(selecToId(updateLngSelec)).val(newLocation.find(selecToClass(locLngSelec)).text());
                    $(selecToId(updateDescSelec)).val(newLocation.find(selecToClass(locDescSelec)).text());
                    
                    if(updateCallback) 
                        updateCallback(locId);

                });

                var deleteBtn = newLocation.find(selecToClass(deleteSelec))
                deleteBtn.click(function() {
                    if(deleteCallback) 
                        deleteCallback(locId);
                });

            },
            removeLocation: function(id) {

                markerArray[id].setMap(null);
                delete markerArray[id];
                
                this.getLocation(id).remove();

            },
            getLocation: function(id) {

                var items = $(selecToClass(listSelec)).find('li');

                for(var i=0; i<items.length; i++) {

                    var item = $(items[i]);
                    if(parseInt(item.attr('data-locid')) === id)
                        return item;

                }

            },
            editLocation: function(location) {

                if(markerArray[location.id]) 
                    markerArray[location.id].setMap(null);
                delete markerArray[location.id];

                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(location.latitude,location.longitude),
                    title: location.title
                });

                markerArray[location.id] = marker;
                marker.setMap(map);

                var element = this.getLocation(location.id);
                element.find(selecToClass(locTitleSelec)).text(location.title);
                element.find(selecToClass(locLatSelec)).text(location.latitude);
                element.find(selecToClass(locLngSelec)).text(location.longitude);
                element.find(selecToClass(locDescSelec)).text(location.description);

            },
            getCreateFormData: function() {

                return {
                    title:          $(selecToId(createTitleSelec)).val(),
                    description:    $(selecToId(createDescSelec)).val(),
                    latitude:       $(selecToId(createLatSelec)).val(),
                    longitude:      $(selecToId(createLngSelec)).val(),
                }

            },
            getUpdateFormData: function() {

                return {
                    id:             parseInt($(selecToClass(updateFormSelec)).attr('data-locid')),
                    title:          $(selecToId(updateTitleSelec)).val(),
                    description:    $(selecToId(updateDescSelec)).val(),
                    latitude:       $(selecToId(updateLatSelec)).val(),
                    longitude:      $(selecToId(updateLngSelec)).val(),
                }

            }
        }

    }

    var lManager = new LocationManager();

    var url = "http://localhost:5000";

    // Initialize location list
    $.ajax(url + '/api/locations', {
        method: 'GET',
        success: function(locations) {
            lManager.initializeList(locations, null, function(id) {

                    //Delete location
                    $.ajax(url + '/api/location/' + id, {
                        method: 'DELETE',
                        success: function(response) {
                            lManager.removeLocation(response.id)
                        },
                        error: function(error) {
                            alert(JSON.parse(error.responseText).error);
                        }
                    });

                });
        },
        error: function(error) {
            alert(JSON.parse(error.responseText).error);
        }
    });

    // Create location
    $(selecToClass(createFormSelec)).submit(function(event) {

        event.preventDefault();

        $.ajax(url + '/api/location', {
            method: 'POST',
            data: lManager.getCreateFormData(),
            success: function(response) {

                $(selecToClass(createFormSelec) + ' input[type=text]').val('');
                lManager.addLocation(response.location, null, function(id) {

                    //Delete location
                    $.ajax(url + '/api/location/' + id, {
                        method: 'DELETE',
                        success: function(response) {
                            lManager.removeLocation(response.id);
                        },
                        error: function(error) {
                            alert(JSON.parse(error.responseText).error);
                        }
                    });

                });
            },
            error: function(error) {
                alert(JSON.parse(error.responseText).error);
            }
        });

    });

    $(selecToClass(updateFormSelec)).submit(function(event) {

        event.preventDefault();

        // Update location
        $.ajax(url + '/api/location', {
            method: 'PUT',
            data: lManager.getUpdateFormData(),
            success: function(response) {

                lManager.editLocation(response.location);
                $('#update_modal').modal('hide');

            },
            error: function(error) {
                alert(JSON.parse(error.responseText).error);
            }
        });

    });

});