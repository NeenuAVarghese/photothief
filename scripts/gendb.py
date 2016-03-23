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
victims = [ "Anton", "Apolonia", "Arturo", "Azalee", "Basilia", "Bertram", "Bobbie", "Bobby", "Calista", "Charlena", "Damian", "Del", "Dolly", "Doug", "Drusilla", "Eryn", "Golda", "Hertha", "Howard", "Inger", "Irwin", "Ivette", "Jeni", "Jess", "Jonell", "Kasha", "Kimberlee", "Kirsten", "Kitty", "Lin", "Luciana", "Ludie", "Mason", "Maxine", "Merlyn", "Mica", "Michiko", "Odilia", "Piper", "Shelton", "Susan", "Tanja", "Temeka", "Terisa", "Timmy", "Val", "Wava", "Wilson", "Winfred", "Yahaira" ]
words = ["Adorable", "Amusing", "Bashful", "Brave", "Carefree", "Challenging", "Clever", "Cozy" "Crawling", "Creeping", "Cruel", "Difficult", "Easy", "Fair", "Foolish", "Friendly", "Generous", "Gloomy", "Grand", "Grimy", "Hardworking", "Hideous", "Huge", "Kind", "Loud", "Meek", "Moody", "Nasty", "Petite", "Polite", "Quick", "Rich", "Scared", "Shrill", "Sizzling", "Sloppy", "Smooth", "Sparkling", "Splendid", "Steaming", "Stingy", "Stuffed", "Swift", "Tiny", "Truthful", "Wild", "Worried"]
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
	global n
	n = ""
	newuser()
	n = ","

def newphoto(oldname="000.jpg"):
	# string format
	photo = w + "{{" + f + "'id': {0}," + f + "'src': '{1}'," + f
	photo += "'createDate': {2}," + f + "'score': {3}," + f
	photo += "'source': 'own'," + f + "'used': {4}," + f
	photo += "'userId': {5}" + d + "}}" + n

	# generate data
	global pid
	rand9 = "%09d" %random.randrange(10**9)
	timestamp = "1456" + rand9
	newfile = "photos/ptimg-" + timestamp + ".jpg"
	score = random.randrange(30)
	used = random.choice(["true", "false"])
	userid = random.randrange(5)
	x_print(photo.format(pid, newfile, timestamp, score, used, userid).replace("'", "\""))

	# rename images
	call(["mv", "-v", "photos/" + oldname, newfile])

	# generate demand
	if used == "false":
		newdemand(pid, userid)
	pid += 1

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
	global n
	n = ""
	newphoto(gallery[total-1])
	n = ","

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
	points = random.randrange(500)
	vmail = random.choice(words).lower() + random.choice(victims).lower()
	vmail += "@" + random.choice(webmail) + ".com"
	b64sum = base64.b64encode(bytes(vmail + str(did), "utf-8"))
	url = str(b64sum).split("'")[1].replace("=", ".")#[:11]
	ransoms.append(demand.format(did, vmail, timestamp, points, pid, uid, url).replace("'", "\""))
	did += 1

def gen_demands():
	global ransoms
	print(ransoms[-1])
	ransoms[-1] = ransoms[-1].rstrip(",")
	print(ransoms[-1])
	#random.shuffle(ransoms)
	x_print('\n'.join(ransoms))

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
	x_print(s + "]")

	x_print("}")

# Run
print_json()
