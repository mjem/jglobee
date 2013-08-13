jGlobee
========

Introduction
------------

jGlobee is a `jQuery <http://jquery.com>`_ plugin which renders an interactive
3d Earth model inside an HTML ``<div>`` element using WebGL via `three.js
<http://threejs.org>`_.

The user can spin, zoom, and pan the camera around the scene.

Construction parameters can be used to control the texture maps, Sun
visibility and to add artifacts to the scene. Each artifact is a solid
sphere with a configurable position (latitude/longitude), size and colour.

Gallery
-------

  .. image:: img/screenshot.jpeg
    :width: 200px
    :target: img/screenshot.jpeg

Demo
----

See `demo <demo.html>`_.

Example
-------

Set up the control rendering to a ``div`` named ``container`` with 3 cities highlighted:

  .. code:: javascript

    var madrid = {id:'madrid',
                  color: 0x00ffff,
                  radius: 1,
                  lat: 40.24,
                  lon: -3.41};
    var scicily = {color: 0x00ff00,
                   radius: 1,
                   lat: 37,
                   lon: 14};
    var newyork = {color: 0xffff00,
                   radius: 1,
                   lat: 43,
                   lon: -75};
    cities = [madrid,
              scicily,
              newyork]
    $('#container').jglobee({artifacts: cities});


Prerequisites
-------------

The plugin requires a browser with WebGL support (obviously), ``jQuery``, ``three`` and the
plugin ``OrbitControls.js`` from the ``examples`` directory of the ``three`` distribution.

For example a suitable set of includes would be:

  .. code:: html

    <script src="http://code.jquery.com/jquery-1.10.2.min.js" type="text/javascript"></script>
    <script src="js/three.min.js" type="text/javascript"></script>
    <script src="js/OrbitControls.js" type="text/javascript"></script>
    <script src="js/jglobee.js" type="text/javascript"></script>

Options
-------

The following construction options are available for the plugin:

earthTexture
    Name of the main Earth texture map to use. If omitted ``img/Pathfinder.jpeg`` is used.

earthNormal
    Name of an image to use as a normal map. If omitted is used.

earthSpecular
    Name of an image to use as the specular map. If omitted is used.

sun
    Boolean specifying if the Sun should be included in the scene. Default is true.

artifacts
    A list of items to display on the surface of the rendered Earth. Each artifact is a hash
    containing:

    color
        Required color as a numerical value e.g. 0x00ff00 for pure green.

    radius
         Size of the artifact. ``1`` is about the size of a major city.

    lat
        Latitude as a float in units of ``degrees``.``minutes``.

    lon
        Longitude as a float in units of ``degrees``.``minutes``.

Textures
--------

In the ``img`` directory are 3 texture files:

`PathfinderMap.jpeg <img/PathfinderMap.jpeg>`_
    A 4096x2048 resolution true colour, cloud free cylindrical Earth texture
    with no ocean markings built from NOAA AVHRR data.
    Available copyright free from http://www.evl.uic.edu/pape/data/Earth courtesy of Dave Pope,
    NASA/GSFC. NASA does not endorse this software in any way.

`EarthNormal-medres.jpeg <img/EarthNormal-medres.jpeg>`_
    A 4096x2048 normal map of the Earth.
    Created using original NASA data from http://mirrors.arsc.edu/nasa/topography by John k. Van Vliet.
    This and other normal maps available from
    http://www.celestiamotherlode.net/catalog/earthbumpspec.php.
    The high resolution map gives slighly better image quality at a considerable cost to page loading
    times.

`EarthSpecular.png <img/EarthSpecular.png>`_
    A 1024x512 specular map of the Earth with fully reflective oceans and
    partially reflective land. Created using original NASA data by Jestr <jestr@ntlworld.com>
    and available from http://www.celestiamotherlode.net/catalog/earthbumpspec.php.
    Images recoloured myself to increase the land reflectivness.

Other textures
--------------

A set of very high resolution, colourful Earth textures is available from
the page of Paul Illsley at http://www.paulillsley.com/gia.

The NASA Blue Marble images are available as cylindrical maps from http://visibleearth.nasa.gov.

Other textures are available.

Homepage
---------

See http://github.com/mjem/jglobee.

Legal
-----

jGlobee is copyright 2013 Mike Elson

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this software except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

..
    Local Variables:
    mode: rst
    coding: utf-8
    indent-tabs-mode: t
    tab-width: 4
    sentence-end-double-space: nil
    fill-column: 80
    End:
