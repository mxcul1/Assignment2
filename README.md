# Assignment3

In this assignment, we will be going through project inception: doing some initial investigation
into what will be needed, and deciding on an approach that’s right for our team.

Scenario:
You are a member of a development team and you have been asked to develop an application that
requires data from IoT sensors. You are not sure whether to develop an on-promise server or cloudbased
serverless application.
Your task is to investigate both techniques and decide which one is better for your application.
To investigate, you need to conduct spikes (least two), each one represents one technique.

System Components
The system consists of the following components:
1. A node.js program that reads data from the motion sensor and pushes it to Firebase DB. The data
is a json object has three attributes (Same App for all spikes):
  1.1. Timestamp
  1.2. Motion start time
  1.3. Motion end time
Ref: Week 3 Lab sheet
2. Another program that (different program):
  2.1. listens to the Firebase DB
  2.2. For each new object, you have to perform two functions:
    2.2.1.Function 1: Sends email to a pre-defined address if the motion is long
    2.2.2.Function 2: Sends another email to a pre-defined address shows how many long and
    short motions have been detected. 

