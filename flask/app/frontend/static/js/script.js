$(window).ready(function() {

    var LocationManager = function() {

        var createLocSelec = '.create-location';
        var updateLocSelec = '.update-location';
        var updateSelec = 'location-update';
        var deleteSelec = 'location-delete';
        var list = $('.locations-list');

        var markerArray = {}

        var mapOptions = {
            center: { 
                lat: 0, 
                lng: 0
            },
            zoom: 1
        };

        var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

        google.maps.event.addListener(map, 'click', function(evt) {
            $('#create_latitude').val(evt.latLng.lat());
            $('#create_longitude').val(evt.latLng.lng());
        });
        
        function getFieldVal(formSelec, name) {
            return $(formSelec + ' input[name=' + name + ']').val()
        }

        function newListItem(location) {

            var item = $('<li></li>');
            item.attr('data-locid', location.id);

            var title = $('<h3></h3>')
            .addClass('location-title')
            .text(location.title)
            .appendTo(item);

            $('<p></p>')
            .addClass('location-latitude')
            .text(location.latitude)
            .appendTo(item);

            $('<p></p>')
            .addClass('location-longitude')
            .text(location.longitude)
            .appendTo(item);

            $('<p></p>')
            .addClass('location-description')
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

            list.append(item);

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

                var updateBtn = newLocation.find('.' + updateSelec)
                updateBtn.click(function() {

                    $('.location-update').attr('data-locid', locId);
                    $('#update_title').val(newLocation.find('.location-title').text());
                    $('#update_latitude').val(newLocation.find('.location-latitude').text());
                    $('#update_longitude').val(newLocation.find('.location-longitude').text());
                    $('#update_description').val(newLocation.find('.location-description').text());
                    
                    if(updateCallback) 
                        updateCallback(locId);

                });

                var deleteBtn = newLocation.find('.' + deleteSelec)
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

                var items = list.find('li');

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
                element.find('.location-title').text(location.title);
                element.find('.location-latitude').text(location.latitude);
                element.find('.location-longitude').text(location.longitude);
                element.find('.location-description').text(location.description);

            },
            getCreateFormData: function() {

                return {
                    title:          getFieldVal(createLocSelec, 'title'),
                    description:    getFieldVal(createLocSelec, 'description'),
                    latitude:       getFieldVal(createLocSelec, 'latitude'),
                    longitude:      getFieldVal(createLocSelec, 'longitude')
                }

            },
            getUpdateFormData: function() {

                return {
                    id:             parseInt($('.location-update').attr('data-locid')),
                    title:          getFieldVal(updateLocSelec, 'title'),
                    description:    getFieldVal(updateLocSelec, 'description'),
                    latitude:       getFieldVal(updateLocSelec, 'latitude'),
                    longitude:      getFieldVal(updateLocSelec, 'longitude')
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
    $('.create-location').submit(function(event) {

        event.preventDefault();

        $.ajax(url + '/api/location', {
            method: 'POST',
            data: lManager.getCreateFormData(),
            success: function(response) {

                $('.create-location input[type=text]').val('');
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

    $('.update-location').submit(function(event) {

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