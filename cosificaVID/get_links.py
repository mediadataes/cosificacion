from bs4 import BeautifulSoup as bs
import requests
import csv

with open('videos.csv', 'w', newline='') as csvfile:
    csv_writer = csv.writer(csvfile, delimiter=';', quotechar='|', quoting=csv.QUOTE_MINIMAL)
    csv_writer.writerow(['Title', 'URL'])

    r = requests.get('https://www.youtube.com/playlist?list=PL4XLEC-MUq2uP2OhrGWdOErGUDrEquhqi')
    page = r.text
    soup = bs(page, 'html.parser')
    res = soup.find_all('a', {'class': 'pl-video-title-link'})
    print("Found: "+str(len(res))+" items")

    for l in res:
        title = l.getText()
        title = title.strip()
        url = "https://youtube.com"+l.get("href")

        print(title+"   :::::   "+url)
        csv_writer.writerow([title, url])
