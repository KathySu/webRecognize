# pip3 install flask

import re
from flask import Flask, jsonify, render_template, request
from datetime import timedelta
app = Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = timedelta(seconds=1)






dirDict = {'North': 'N', 'South': 'S', 'West': 'W', 'East': 'E'}

def search(regex, text):
    result = ""
    errorMessage = ""

    # regex= r"\W+(?P<dir1>North|South|West|East)\W+(?P<degrees>\d+)\W+degrees\W+(?P<minutes>\d+)\W+minutes\W+(?P<dir2>North|South|West|East)(?:.|\n)*?distance of\W+(?P<feet>\d+.?\d+)"

    m = re.findall(regex, text, re.IGNORECASE)
    strm = map(str, m)
    # messagebox.showinfo(title = "The count of the result is " + str(len(m)), message = " The content of the result is: \n" + '\n'.join(strm) )
    
    resultList = []
    i = 0
    for matches in re.finditer(regex, text, re.IGNORECASE):
        i = i + 1
        # messagebox.showinfo(message = str(matches.groupdict()))
        gd = matches.groupdict()
        resultList.append({'start': matches.start(), 'end': matches.end(), 'index' : i})
        # messagebox.showinfo(message = "The begin and end pos of the mathch is : " + str(matches.start())+ "-" + str(matches.end()))
        

        # if "dir1" in gd:
        #     messagebox.showinfo(message = "has dir1")
        # else :
        #     messagebox.showinfo(message = "doesn't have dir1")

        # matches.groupdict
        dir1 = ''
        if matches.group('dir1') is None :
            # messagebox.showinfo(message='dir1 is none')
            errorMessage += "dir1 is none"
        else:
            dir1 = matches.group('dir1')
            # resultList.append({'start': matches.start(), 'end': matches.end(), 'index' : i})
       
 
            

        degrees = ''
        if matches.group('degrees') is None :
            # messagebox.showinfo(message='degrees is none')
            errorMessage += "degrees is none"
        else:
            degrees = matches.group('degrees')
            # g = degrees
            # resultList.append({'start': g.start(), 'end': g.end(), 'index' : i})
  
        minutes = ''
        if matches.group('minutes') is None :
            errorMessage += "minutes is none"
        else:
            minutes = matches.group('minutes')
            # g = minutes
            # resultList.append({'start': g.start(), 'end': g.end(), 'index' : i})

        seconds = "00"


        dir2 = ''
        if matches.group('dir2') is None :
            errorMessage += "dir2 is none"
        else:
            dir2 = dirDict[matches.group('dir2')]
            # g = dir2
            # resultList.append({'start': g.start(), 'end': g.end(), 'index' : i})

        feet = ''
        if matches.group('feet') is None :
           errorMessage += "feet is none"
        else:
            feet = matches.group('feet')
            # g = feet
            # resultList.append({'start': g.start(), 'end': g.end(), 'index' : i})


        result = result + "DD " + dir1 + " " + degrees + "-" + minutes + "-" + seconds + " " + dir2 + " " + feet + '\n'
    return {'result' : result, 'highlight' : resultList}




@app.route('/')
def index():
    return render_template('index.html')


@app.route('/_recognize')
def recognize():
    x = '\W+(?P<dir1>South|North|West|East)\W+(?P<degrees>\d+)\W+degrees?\W+(?P<minutes>\d+)\W+minutes?\W+[(?P<seconds>\d+)\W+seconds?\W+]?(?P<dir2>South|North|West|East)(.|\n)*?(?P<distance>\d+.\d+)\W+feet'
    reg_expression = request.args.get('reg_expression', '')
    reg_text = request.args.get('reg_text', '')
    
    result = search(reg_expression, reg_text)

    return jsonify(result = result)



if __name__ == '__main__':
    app.run(debug=True)