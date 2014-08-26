import sys
import os
import requests
import pickle
import re
from lxml import html
from google import search

class movieData():
  def __init__(self):
    title="-"
    img="-"
    director="-"
    actors="-"
    genre="-"
    plot="-"
    length="-"
    path=""
  def __str__(self):
    return "|".join([name+":"+getattr(self,name) for name in dir(self) if not name.startswith('_')]).encode("utf-8")

def webParser(title_to_search):
  print title_to_search
#imdb_url="http://www.imdb.com/title/tt1631867/"
  imdb_url = search(title_to_search+" imdb",num=1, stop=1, only_standard=True).next()
  print imdb_url
  
  page = requests.get(imdb_url)
  tree = html.fromstring(page.text)
  data=movieData()
  try:
    data.title = tree.xpath('//span[@itemprop="name"]')[0].text.strip()
  except IndexError:
    pass
  
  try:
    data.img = tree.xpath('//img[@itemprop="image"]')[0].values()[-2]
  except IndexError:
    pass
  
  try:
    data.director = tree.xpath('//div[@itemprop="director"]//span[@itemprop="name"]')[0].text.strip()
  except IndexError:
    pass
  
  try:
    data.actors = ", ".join(map(lambda x: x.text,tree.xpath('//div[@itemprop="actors"]//span[@itemprop="name"]')))
  except IndexError:
    pass
  
  try:
    data.genre = ", ".join(map(lambda x: x.text.strip(),tree.xpath('//span[@itemprop="genre"]')))
  except IndexError:
    pass
  
  try:
    data.plot = tree.xpath('//p[@itemprop="description"]')[0].text.strip()
  except IndexError:
    pass 
  
  try:
    data.length = tree.xpath('//time[@itemprop="duration"]')[0].text.strip().split()[0]
  except IndexError:
    pass 
  
  return data


def dirParser(directory, results):
  act_dir=directory
  for d in os.listdir(directory):
    #print "/".join([act_dir,d])
    if (os.path.isdir("/".join([act_dir,d]))):
      dirParser("/".join([act_dir,d]),results)
    else:
      if ("/".join([act_dir,d]).split(".")[-1].lower() in ['mpg','avi','vob','mts', 'amv','wmv','mov','mp4','mkv']):
        results.append("/".join([act_dir,d]))
  return 0;
  
  
def main():
  results = []
  path = sys.argv[1]
  orig_dir=os.getcwd()
  os.chdir(path)
  #db_file=open("movie_db.txt","w")
  series_rule=re.compile('(.+)(s|S)([0-9])+(e|E)([0-9])+')
  date_rule=re.compile('.+\d{4}')
  date_rule2=re.compile('.+\s(\d{4})\s')
  bracket_rule=re.compile('.?\[.*\]')
  for d in os.listdir("."):
    act_dir=path+"/"+d
    #print act_dir
    if (os.path.isdir(act_dir)):
      dirParser(act_dir,results)
    else:
      if (act_dir.split(".")[-1].lower() in ['mpg','avi','vob','mts', 'amv','wmv','mov','mp4','dat','mpeg','mts','divx','xvid']):
        results.append(act_dir)
  results.sort()
  os.chdir(orig_dir)
  db_file=open("movie_db.txt","w")
  for id,path in enumerate(results):
    title=path.split("/")[-2].replace("."," ")
    #title=" ".join(path.split("/")[-1].split(".")[0:-1])
    match_obj=series_rule.match(title)
    if (match_obj!=None):
      title=title[0:match_obj.end()-6]+title[match_obj.end()-6:match_obj.end()-3].replace("s","season ")+title[match_obj.end()-3:match_obj.end()].replace("e"," episode ")
    match_obj=date_rule.match(title)
    if (match_obj!=None):
      title=title[0:match_obj.end()-4]
    match_obj=date_rule2.match(title)
    if (match_obj!=None):
      title=title[0:match_obj.end()-4]
    match_obj=bracket_rule.match(title)
    if (match_obj!=None):
      title=title[match_obj.end():-1]
    data=webParser(title.strip())
    data.path=path
    data.title=title
    db_file.write("id:"+str(id)+"|"+str(data))
    db_file.write("\n")
#writing results is wrong, use iteritems instead, open file before for cicle
#need more regexp to filter out things like [], www, xyRip, etc
  db_file.close()
    
  
  
if __name__ == "__main__":
    main()
