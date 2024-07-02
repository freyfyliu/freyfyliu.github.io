---
permalink: /
title: "About me"
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

I am a PhD student in Astronomy at the [Institute for Astronomy](https://ifa.roe.ac.uk/), [University of Edinburgh](https://www.ed.ac.uk/), [Royal Observatory of Edinburgh](https://www.roe.ac.uk/).
My PhD study is under the supervision of Prof. [James Dunlop](https://www.roe.ac.uk/~jsd/), Prof. [Ross McLure](https://www.roe.ac.uk/~rjm/Ross_McLures_Webpage/Welcome.html), and Dr. [Derek McLeod](https://www.roe.ac.uk/ifa/people/mcleod.html) and funded by the [Mary Brück](https://en.wikipedia.org/wiki/Mary_Br%C3%BCck) scholarship.
Before PhD study, I obtained Master in Astrophysics from the National Astronomical Observatory of Chinese Academy of Sciences ([NAOC](https://english.nao.cas.cn/)) and Bachelor in Astronomy from Nanjing University ([NJU](https://astronomy.nju.edu.cn/EN/index.html)).

My Chinese given name means "abundant sources".
It is difficult to not become an observer with such a name.
My current research focuses on star-forming galaxies and active galactic nuclei at different epochs of the universe observed at different wavelengths.
Specifically, I am working on the following two directions.

Dust-obscured star formation in the young Universe revealed by combining JWST PRIMER and ALMA
======
A significant fraction of star formation over cosmic history is obscured by dust, which absorbs UV light and re-emits at far-infrared/millimeter wavelengths. 
However, completing our census of cosmic star formation, combining the unobscured (UV/optical) and obscured (far-infrared/mm) star-forming galaxy populations has proved challenging due to the difficulties of combining datasets at very different wavelengths (and often different resolutions). 
Indeed, many dusty sources detected at (sub-)mm wavelengths have proved difficult to detect at short wavelengths, even with Hubble.  
However, the additional depth and near-infrared wavelength coverage delivered by JWST is now transforming this field. 
Aided by the excellent astrometric accuracy delivered by both JWST and ALMA,  we use the (now complete) JWST PRIMER NIRCam+MIRI imaging in the COSMOS PRIMER field  to identify the galaxy counterparts to 99% of the known mm-wavelength sources in the field, as revealed by the ALMA A3COSMOS database. 
Never before has such a large and deep mm-wavelength sample been essentially completely and robustly identified at rest-frame optical wavelengths, and we use detailed spectral evolution fitting to determine the redshift distribution and physical properties (star-formation rates, ages, stellar masses) of the dust-enshrouded population. 
Moreover, the mm depth and optical ID completeness of our sample enables us to set new constraints on the contribution of dust-enshrouded galaxies to the rise of star-formation density at early times.

Getting started
======
1. Register a GitHub account if you don't have one and confirm your e-mail (required!)
1. Fork [this repository](https://github.com/academicpages/academicpages.github.io) by clicking the "fork" button in the top right. 
1. Go to the repository's settings (rightmost item in the tabs that start with "Code", should be below "Unwatch"). Rename the repository "[your GitHub username].github.io", which will also be your website's URL.
1. Set site-wide configuration and create content & metadata (see below -- also see [this set of diffs](http://archive.is/3TPas) showing what files were changed to set up [an example site](https://getorg-testacct.github.io) for a user with the username "getorg-testacct")
1. Upload any files (like PDFs, .zip files, etc.) to the files/ directory. They will appear at https://[your GitHub username].github.io/files/example.pdf.  
1. Check status by going to the repository settings, in the "GitHub pages" section

Site-wide configuration
------
The main configuration file for the site is in the base directory in [_config.yml](https://github.com/academicpages/academicpages.github.io/blob/master/_config.yml), which defines the content in the sidebars and other site-wide features. You will need to replace the default variables with ones about yourself and your site's github repository. The configuration file for the top menu is in [_data/navigation.yml](https://github.com/academicpages/academicpages.github.io/blob/master/_data/navigation.yml). For example, if you don't have a portfolio or blog posts, you can remove those items from that navigation.yml file to remove them from the header. 

Create content & metadata
------
For site content, there is one markdown file for each type of content, which are stored in directories like _publications, _talks, _posts, _teaching, or _pages. For example, each talk is a markdown file in the [_talks directory](https://github.com/academicpages/academicpages.github.io/tree/master/_talks). At the top of each markdown file is structured data in YAML about the talk, which the theme will parse to do lots of cool stuff. The same structured data about a talk is used to generate the list of talks on the [Talks page](https://academicpages.github.io/talks), each [individual page](https://academicpages.github.io/talks/2012-03-01-talk-1) for specific talks, the talks section for the [CV page](https://academicpages.github.io/cv), and the [map of places you've given a talk](https://academicpages.github.io/talkmap.html) (if you run this [python file](https://github.com/academicpages/academicpages.github.io/blob/master/talkmap.py) or [Jupyter notebook](https://github.com/academicpages/academicpages.github.io/blob/master/talkmap.ipynb), which creates the HTML for the map based on the contents of the _talks directory).

**Markdown generator**

I have also created [a set of Jupyter notebooks](https://github.com/academicpages/academicpages.github.io/tree/master/markdown_generator
) that converts a CSV containing structured data about talks or presentations into individual markdown files that will be properly formatted for the Academic Pages template. The sample CSVs in that directory are the ones I used to create my own personal website at stuartgeiger.com. My usual workflow is that I keep a spreadsheet of my publications and talks, then run the code in these notebooks to generate the markdown files, then commit and push them to the GitHub repository.

How to edit your site's GitHub repository
------
Many people use a git client to create files on their local computer and then push them to GitHub's servers. If you are not familiar with git, you can directly edit these configuration and markdown files directly in the github.com interface. Navigate to a file (like [this one](https://github.com/academicpages/academicpages.github.io/blob/master/_talks/2012-03-01-talk-1.md) and click the pencil icon in the top right of the content preview (to the right of the "Raw | Blame | History" buttons). You can delete a file by clicking the trashcan icon to the right of the pencil icon. You can also create new files or upload files by navigating to a directory and clicking the "Create new file" or "Upload files" buttons. 

Example: editing a markdown file for a talk
![Editing a markdown file for a talk](/images/editing-talk.png)

For more info
------
More info about configuring Academic Pages can be found in [the guide](https://academicpages.github.io/markdown/). The [guides for the Minimal Mistakes theme](https://mmistakes.github.io/minimal-mistakes/docs/configuration/) (which this theme was forked from) might also be helpful.
