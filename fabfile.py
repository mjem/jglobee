#!/usr/bin/env python

from __future__ import print_function

import os

from fabric.api import run
from fabric.api import cd
from fabric.api import prefix
from fabric.api import env
from fabric.api import path
from fabric.api import local

def build():
	"""Build derived files"""

	local('chart/tools/build.sh')


def commit(comment='checkpoint'):
	"""Commit local changes.
	Usage: fab commit:"Hello this message"
	"""

	local('hg commit -m"{comment}"'.format(comment=comment))


def archive():
	"""Create jglobee.tar.bz2 archive from hg repository"""
	local('hg archive jglobee.tar.bz2')

manifest = ['demo.html',
			'js/jglobee.js',
			'js/three.min.js',
			'js/OrbitControls.js',
			'img/PathfinderMap.jpeg',
			'img/EarthNormal-medres.jpeg',
			'img/EarthSpecular.png',
			'img/screenshot.jpeg',
			'fabfile.py',
			'README.rst',
			'jglobee.jquery.json',
			]

def dist():
	"""Build distribution package."""
	import tarfile
	version = '0.1'
	prefix = 'jglobee-{version}'.format(version=version)
	filename = '{prefix}.tar.bz2'.format(prefix=prefix)
	tar = tarfile.open(filename, 'w:bz2')
	for f in manifest:
		tar.add(f, os.path.join(prefix, f))

	print('Wrote distribution file to {filename}'.format(filename=filename))

def hg():
	"""Create jglobee.hg.tar.bz2 archive containing hg repository"""
	local('tar cf jglobee.hg.tar.bz2 .hg')


def update():
	"""Pull in new code from upstream"""
	local('hg pull -u')


def clean():
	"""Delete intermediate files returning directory to its pristine state.
	"""
	pass
