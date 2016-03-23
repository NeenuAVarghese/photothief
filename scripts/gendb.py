#!/usr/bin/env python3
import os
import random
import base64
from os.path import basename
from subprocess import call

# variables
uid = 0
pid = 0
did = 0
thieves = [ "Kevin", "David", "Neenu", "Anusha", "Chris" ]
webmail = [ "aol", "gmail", "hotmail", "yahoo" ]
victims = [ "Bob", "Diana", "Elektra", "Jean", "Natalia", "Selina", "Susan" ]
words = [ "bubble", "cute", "chair", "diamond", "funny", "star", "sponge", "tall" ]
ransoms = []

# whitespace
d = "\n    "
f = "\n      "
s = "  "
w = "    "
n = ","

# write to file
logfile = True
if logfile:
	try:
		log = open("jsondb/newdb.json", 'w')
	except ValueError: "cannot write file"

def x_print(text):
	global logfile
	if logfile:
		log.write(text + "\n")
	elif verbose:
		print(text)

def newuser():
	# string format
	user = w + "{{" + f + "'id': {0}," + f + "'name': '{1}'," + f
	user += "'email': '{2}'," + f + "'loginId': '{3}'," + f
	user += "'password': '{4}'," + f + "'avatar': ''," + f
	user += "'notify': {5}" + d + "}}" + n

	# generate data
	global uid
	name = thieves[uid]
	login = name.lower()
	domain = random.choice(webmail)
	email = login + "@" + domain + ".com"
	passwd = "secret"
	notify = random.randrange(4)
	x_print(user.format(uid, name, email, login, passwd, notify).replace("'", "\""))
	uid += 1

def gen_users():
	testers = len(thieves)
	for i in range(0, testers-1):
		newuser()
	n = ""
	newuser()

def newphoto(oldname="000.jpg"):
	# string format
	photo = w + "{{" + f + "'id': {0}," + f + "'src': '{1}'," + f
	photo += "'createDate': {2}," + f + "'score': {3}," + f
	photo += "'source': 'own'," + f + "'used': false," + f
	photo += "'userId': {4}" + d + "}}" + n

	# generate data
	global pid
	rand6 = "%06d" %random.randrange(10**6)
	timestamp = "1456" + rand6 + str(pid)
	newfile = "photos/ptimg-" + timestamp + ".jpg"
	score = random.randrange(30)
	userid = random.randrange(5)

	# generate demand
	newdemand(pid, userid)

	x_print(photo.format(pid, newfile, timestamp, score, userid).replace("'", "\""))
	pid += 1

	# rename images
	#call(["mv", "-v", "photos/" + oldname, newfile])

def gen_photos():
	gallery = []
	# find photos in directory
	files = sorted(os.listdir("photos"))
	for f in files:
		if f.endswith(".jpg"):
			# get photo filename
			gallery.append(basename(f))

	total = len(gallery)
	for i in range(0, total-1):
		newphoto(gallery[i])
	n = ""
	newphoto(gallery[total-1])

def newdemand(pid, uid):
	# string format
	demand = w + "{{" + f + "'id': {0}," + f + "'victimEmail': '{1}'," + f
	demand += "'createDate': {2}," + f + "'demand': '{3} Points'," + f
	demand += "'photoId': {4}," + f + "'userId': {5}," + f
	demand += "'hash': '{6}'," + f + "'met': false" + d + "}}" + n

	# generate data
	global did, ransoms
	rand9 = "%09d" %random.randrange(10**9)
	timestamp = "1458" + rand9
	points = random.randrange(9999)
	vmail = random.choice(words) + random.choice(victims).lower()
	vmail += "@" + random.choice(webmail) + ".com"
	b64sum = base64.b64encode(bytes(vmail + str(did), "utf-8"))
	url = str(b64sum).split("'")[1].replace("=", ".")[:11]
	ransoms.append(demand.format(did, vmail, timestamp, points, pid, uid, url).replace("'", "\""))
	did += 1

def gen_demands():
	global ransoms
	random.shuffle(ransoms)
	x_print(''.join(ransoms))

def print_json():
	x_print("{")

	# users
	x_print(s + "'users': [".replace("'", "\""))
	gen_users()
	x_print(s + "],")

	# photos
	x_print(s + "'photos': [".replace("'", "\""))
	gen_photos()
	x_print(s + "],")

	# demands
	x_print(s + "'demands': [".replace("'", "\""))
	gen_demands()
	x_print(s + "],")

	x_print("}")

# Run
print_json()
