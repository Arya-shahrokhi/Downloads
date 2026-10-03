import json, math, random, sys, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
FONT='/usr/local/share/fonts/google/vazirmatn/Vazirmatn[wght].ttf'
def font(size, w='Bold'):
    f=ImageFont.truetype(FONT,size,layout_engine=ImageFont.Layout.RAQM)
    try: f.set_variation_by_name(w)
    except Exception: pass
    return f
S=1600
FA='۰۱۲۳۴۵۶۷۸۹'
def fa(n): return ''.join(FA[int(c)] if c.isdigit() else c for c in str(n))
def hexc(h,a=255):
    h=h.lstrip('#'); return tuple(int(h[i:i+2],16) for i in (0,2,4))+(a,)
def mix(c1,c2,t): return tuple(int(c1[i]*(1-t)+c2[i]*t) for i in range(3))+(255,)
def dark(c,t=.35): return mix(c,(30,20,10),t)
def light(c,t=.4): return mix(c,(255,250,240),t)

# ---------- product -> look ----------
COLORS=[ # keyword, content color, texture
 ('زعفران','#b3151b','threads'),('گل محمدی','#c2446a','petals'),('گل سرخ','#b52a3a','petals'),('گلاب','#f4c7d3','petals'),
 ('نعناع','#4f8a3c','leaves'),('کاسنی','#6f8fd6','petals'),('شاتره','#8b6fa8','leaves'),('بهارنارنج','#f3efe0','petals'),
 ('بیدمشک','#d9d2c0','petals'),('رازیانه','#9aa55a','seeds'),('آویشن','#6d7b3f','leaves'),('کرفس','#7ea34a','leaves'),
 ('زیره سیاه','#3b2d22','seeds'),('زیره','#8c6d3f','seeds'),('خارشتر','#c9a54a','sticks'),('سنجد','#c4834a','fruit'),('دارچین','#8a4a22','sticks'),
 ('زنجبیل','#d6a65a','roots'),('هل سیاه','#3e3026','pods'),('هل','#8fae5a','pods'),('زنیان','#8a7a52','seeds'),('گزنه','#3f7a3a','leaves'),
 ('اسطوخودوس','#7b69b3','petals'),('چای سبز','#6f8f3a','leaves'),('چای سیاه','#3a2418','leaves'),('چای ترش','#9c1f3a','petals'),
 ('چای کوهی','#b39a4a','leaves'),('بابونه','#e8c84a','flowers'),('به‌لیمو','#7a9a4a','leaves'),('گل گاوزبان','#6a4f9a','petals'),
 ('سنبل‌الطیب','#8a6a48','roots'),('پونه','#5a8a44','leaves'),('مرزه','#6f8a48','leaves'),('رزماری','#4a6e4a','leaves'),('اکلیل','#4a6e4a','leaves'),
 ('سیاه‌دانه','#1f1a18','seeds'),('تخم شربتی','#2a2622','seeds'),('بارهنگ','#6a5a3a','seeds'),('خاکشیر','#a8683a','seeds'),('اسفرزه','#b8a58a','seeds'),
 ('قدومه','#6a4a36','seeds'),('کتان','#8a5a32','seeds'),('گشنیز','#b89a5e','seeds'),('شوید','#8a7a4a','seeds'),
 ('میخک','#5a3322','sticks'),('فلفل سیاه','#2e2622','seeds'),('فلفل قرمز','#c0301e','powder'),('زردچوبه','#e0a018','powder'),
 ('سماق','#8a2a2e','powder'),('جوز','#7a4a2a','fruit'),('وانیل','#3a2618','sticks'),('گلپر','#7a6a4a','seeds'),
 ('عسل','#d98e1a','honey'),('موم','#e8c05a','block'),('بره موم','#7a4a1e','block'),('گرده','#e8b02a','seeds'),('ژل رویال','#f2e6c4','honey'),
 ('انجیر','#a8744a','fruit'),('آلو','#3a2030','fruit'),('کشمش','#9a6a2a','fruit'),('توت','#e0cfa0','fruit'),('خرما','#5a2e18','fruit'),
 ('عناب','#8a2418','fruit'),('زرشک','#b0141e','fruit'),('آلبالو','#6a1420','fruit'),('زغال','#4a1428','fruit'),
 ('نبات','#f0d890','crystal'),('شکر سرخ','#9a5a2a','powder'),('شیرین‌بیان','#6a4a2a','roots'),('قاصدک','#8a6a3a','roots'),('ختمی','#e8a0c0','petals'),
 ('پنیرک','#8a4aa0','petals'),('همیشه‌بهار','#f0901a','petals'),('بنفشه','#5a3a9a','petals'),('نسترن','#f2b8c8','petals'),('نیلوفر','#6a8ac8','petals'),
 ('سنا','#7a8a4a','leaves'),('زیتون','#6a7a3a','leaves'),('برگ بو','#4a6a3a','leaves'),('اکالیپتوس','#6a9a8a','leaves'),
 ('پرتقال','#e8841a','peel'),('لیمو','#e0c02a','peel'),('نارنج','#e0701a','peel'),('صندل','#a8683a','sticks'),('کندر','#e8d0a0','crystal'),
 ('مصطکی','#f2eab8','crystal'),('مریم‌گلی','#8a9a8a','leaves'),('کندش','#a8b09a','powder'),('کافور','#f5f5f0','crystal'),('صمغ','#e8c880','crystal'),
 ('کنجد سیاه','#1f1c1a','seeds'),('ارده','#c8a060','honey'),('کنجد','#e8d8b0','seeds'),('نارگیل','#f5f0e6','powder'),('کاکائو','#4a2a1a','powder'),
 ('سیر','#efe6cc','powder'),('پیاز','#e6d4a8','powder'),('جوانه','#d8b878','powder'),('هسته خرما','#5a3a24','powder'),
 ('دنبه','#f0e0b0','honey'),('حیوانی','#f0d060','honey'),('انگور','#c8c060','oil'),('انار','#b0402a','oil'),('آرگان','#d8a040','oil'),('مورد','#6a8a4a','oil'),
 ('بادام تلخ','#e0c070','oil'),('بادام','#e8d080','oil'),('کرچک','#e8dc9a','oil'),('زردآلو','#e8b050','oil'),
 ('آرامش','#8a6ab0','petals'),('سرماخوردگی','#c8702a','leaves'),('لاغری','#6a9a3a','leaves'),('خواب','#5a4a9a','petals'),('انرژی','#d0501a','peel'),
 ('بادرنجبویه','#6a9a4a','leaves'),
]
def look(name):
    if name.startswith('عسل'): return hexc('#d98e1a'),'honey'
    if name.startswith('موم'): return hexc('#e8c05a'),'block'
    base=name
    for pre in ['پودر ','روغن ','عرق ','چای ','ریشه ','برگ ','پوست ','چوب ','تخم ','حب ','عسل ','عصاره ']:
        pass
    for k,c,t in COLORS:
        if k in name: return hexc(c),t
    return hexc('#8a7a4a'),'seeds'

def kind(p):
    n=p['name']; cat=p['category']
    if n.startswith('عرق') : return 'bottle'
    if n.startswith('روغن'): return 'oil'
    if n=='گلاب': return 'bottle'
    if n.startswith('عسل') or n in ('ژل رویال','ارده کنجد','عصاره شیرین‌بیان'): return 'jar'
    if n.startswith('چای') or n.startswith('ترکیب') or n.startswith('حب') or 'دمنوش' in n: return 'tea'
    if n.startswith('پودر') or n in ('زعفران ساییده','سنجد آسیاب‌شده'): return 'powder'
    return 'pouch'

BG={'عرقیات گیاهی':('#e6f1ee','#cfe3dc'),'روغن‌های گیاهی':('#f5efd9','#e8dcae'),'محصولات طبیعی':('#fbf0dc','#f0d9a8'),
    'دمنوش‌ها':('#f5ecf2','#e6d3e0'),'ادویه‌ها':('#fbeee0','#f1d3b4'),'خشکبار':('#f7ece0','#e8d2b8'),
    'گیاهان دارویی':('#eef2e4','#d9e2c8'),'محصولات ویژه':('#f8ebe6','#ecd0c6'),'برنج و غلات':('#f6f1e4','#e6dcc2')}

# ---------- drawing helpers ----------
def rr(d,box,r,**kw): d.rounded_rectangle(box,r,**kw)
def shadow(img,box,blur=40,alpha=70,shape='ellipse'):
    sh=Image.new('RGBA',img.size,(0,0,0,0)); sd=ImageDraw.Draw(sh)
    if shape=='ellipse': sd.ellipse(box,fill=(60,40,20,alpha))
    else: sd.rounded_rectangle(box,60,fill=(60,40,20,alpha))
    sh=sh.filter(ImageFilter.GaussianBlur(blur)); img.alpha_composite(sh)

def texture(img,box,col,tex,seed,mask=None):
    """fill ellipse/box area with texture"""
    x0,y0,x1,y1=box; w,h=x1-x0,y1-y0
    layer=Image.new('RGBA',img.size,(0,0,0,0)); d=ImageDraw.Draw(layer)
    rnd=random.Random(seed)
    d.ellipse(box,fill=dark(col,.25))
    def pt():
        while True:
            u,v=rnd.uniform(-1,1),rnd.uniform(-1,1)
            if u*u+v*v<1: return x0+w/2+u*w/2, y0+h/2+v*h/2
    n={'powder':2500,'seeds':900,'leaves':420,'petals':320,'fruit':70,'threads':700,'sticks':38,'roots':60,'pods':160,'flowers':180,'crystal':90,'peel':110,'block':12,'honey':0,'oil':0}.get(tex,500)
    for i in range(n):
        x,y=pt(); t=rnd.uniform(-.25,.3)
        c=light(col,t) if t>0 else dark(col,-t)
        if tex=='powder':
            r=rnd.uniform(2,6); d.ellipse((x-r,y-r,x+r,y+r),fill=c)
        elif tex=='seeds':
            a=rnd.uniform(0,math.pi); L=rnd.uniform(9,16); r=L*.45
            pts=[(x+math.cos(a)*L*math.cos(s)-math.sin(a)*r*math.sin(s), y+math.sin(a)*L*math.cos(s)+math.cos(a)*r*math.sin(s)) for s in [k*math.pi/8 for k in range(16)]]
            d.polygon(pts,fill=c)
        elif tex=='pods':
            a=rnd.uniform(0,math.pi); L=rnd.uniform(18,26); r=L*.5
            pts=[(x+math.cos(a)*L*math.cos(s)-math.sin(a)*r*math.sin(s), y+math.sin(a)*L*math.cos(s)+math.cos(a)*r*math.sin(s)) for s in [k*math.pi/10 for k in range(20)]]
            d.polygon(pts,fill=c,outline=dark(col,.4))
        elif tex in ('leaves','petals'):
            a=rnd.uniform(0,2*math.pi); L=rnd.uniform(16,34) if tex=='leaves' else rnd.uniform(14,26); r=L*(.35 if tex=='leaves' else .6)
            pts=[(x+math.cos(a)*L*math.cos(s)-math.sin(a)*r*math.sin(s)*abs(math.sin(s))**.2, y+math.sin(a)*L*math.cos(s)+math.cos(a)*r*math.sin(s)*abs(math.sin(s))**.2) for s in [k*math.pi/10 for k in range(20)]]
            d.polygon(pts,fill=c)
        elif tex=='threads':
            a=rnd.uniform(0,2*math.pi); L=rnd.uniform(20,40)
            d.line((x,y,x+math.cos(a)*L,y+math.sin(a)*L),fill=c,width=4)
            d.ellipse((x+math.cos(a)*L-4,y+math.sin(a)*L-4,x+math.cos(a)*L+4,y+math.sin(a)*L+4),fill=hexc('#e0901a') if rnd.random()<.25 else c)
        elif tex=='fruit':
            r=rnd.uniform(24,40); d.ellipse((x-r,y-r*.85,x+r,y+r*.85),fill=c,outline=dark(col,.45),width=3)
            d.ellipse((x-r*.5,y-r*.6,x-r*.1,y-r*.25),fill=light(col,.35))
        elif tex in ('sticks','roots'):
            a=rnd.uniform(-.6,.6)+ (0 if rnd.random()<.5 else math.pi/2); L=rnd.uniform(70,150); wd=rnd.randint(12,22) if tex=='sticks' else rnd.randint(8,16)
            d.line((x-math.cos(a)*L/2,y-math.sin(a)*L/2,x+math.cos(a)*L/2,y+math.sin(a)*L/2),fill=c,width=wd)
            d.line((x-math.cos(a)*L/2,y-math.sin(a)*L/2+wd*.25,x+math.cos(a)*L/2,y+math.sin(a)*L/2+wd*.25),fill=dark(col,.4),width=max(2,wd//4))
        elif tex=='flowers':
            r=rnd.uniform(10,16)
            for k in range(8):
                aa=k*math.pi/4; d.ellipse((x+math.cos(aa)*r-6,y+math.sin(aa)*r-6,x+math.cos(aa)*r+6,y+math.sin(aa)*r+6),fill=(250,248,238,255))
            d.ellipse((x-r*.6,y-r*.6,x+r*.6,y+r*.6),fill=c)
        elif tex=='crystal':
            r=rnd.uniform(18,34); pts=[(x+math.cos(k*math.pi/3+rnd.uniform(-.3,.3))*r*rnd.uniform(.7,1),y+math.sin(k*math.pi/3)*r*rnd.uniform(.7,1)) for k in range(6)]
            d.polygon(pts,fill=light(col,rnd.uniform(0,.4)),outline=dark(col,.2))
        elif tex=='peel':
            a=rnd.uniform(0,2*math.pi); L=rnd.uniform(30,50)
            d.arc((x-L,y-L*.5,x+L,y+L*.5),rnd.randint(0,180),rnd.randint(200,340),fill=c,width=12)
        elif tex=='block':
            r=rnd.uniform(40,70); d.rounded_rectangle((x-r,y-r*.6,x+r,y+r*.6),14,fill=c,outline=dark(col,.3),width=4)
    if tex in ('honey','oil'):
        d.ellipse(box,fill=col); d.ellipse((x0+w*.15,y0+h*.15,x0+w*.55,y0+h*.4),fill=light(col,.35))
    m=Image.new('L',img.size,0); ImageDraw.Draw(m).ellipse(box,fill=255)
    layer.putalpha(ImageChops.multiply(layer.getchannel('A'),m))
    img.alpha_composite(layer)

def fit_text(d,text,maxw,start,minsize=40):
    s=start
    while s>minsize:
        f=font(s,'ExtraBold'); w=d.textlength(text,font=f,direction='rtl')
        if w<=maxw: return f,[text]
        s-=4
    # two lines
    words=text.split(); best=None
    for i in range(1,len(words)):
        a,b=' '.join(words[:i]),' '.join(words[i:])
        m=max(d.textlength(a,font=font(start*.8,'ExtraBold'),direction='rtl'),d.textlength(b,font=font(start*.8,'ExtraBold'),direction='rtl'))
        if best is None or m<best[0]: best=(m,[a,b])
    s=int(start*.8)
    while s>30:
        f=font(s,'ExtraBold')
        if max(d.textlength(t,font=f,direction='rtl') for t in best[1])<=maxw: return f,best[1]
        s-=4
    return font(30,'ExtraBold'),best[1]

def ctext(d,cx,y,text,f,fill):
    w=d.textlength(text,font=f,direction='rtl'); d.text((cx-w/2,y),text,font=f,fill=fill,direction='rtl')

def label(img,box,p,accent):
    d=ImageDraw.Draw(img); x0,y0,x1,y1=box; cx=(x0+x1)/2
    rr(d,box,28,fill=(252,248,238,255),outline=dark(accent,.2),width=5)
    rr(d,(x0+14,y0+14,x1-14,y1-14),20,outline=light(accent,.2),width=2)
    d.rectangle((x0+5,y0+40,x1-5,y0+56),fill=accent)
    f,lines=fit_text(d,p['name'],(x1-x0)-70,96)
    lh=f.size*1.25; th=lh*len(lines); ty=y0+70+((y1-y0-150)-th)/2
    for i,t in enumerate(lines): ctext(d,cx,ty+i*lh,t,f,(46,34,24,255))
    ctext(d,cx,y1-82,'کالاوران',font(38,'Bold'),dark(accent,.15))

def unit_text(p):
    w=p.get('weight'); u=p.get('unit') or 'گرم'
    return f"{fa(w)} {u}" if w else ''

def draw(p):
    col,tex=look(p['name']); k=kind(p)
    b1,b2=BG.get(p['category'],('#f4efe4','#e4d9c2'))
    img=Image.new('RGBA',(S,S),hexc(b1)); d=ImageDraw.Draw(img)
    # gradient
    g=Image.linear_gradient('L').resize((S,S)); bg2=Image.new('RGBA',(S,S),hexc(b2)); img=Image.composite(bg2,img,g); d=ImageDraw.Draw(img)
    # soft circles
    deco=Image.new('RGBA',(S,S),(0,0,0,0)); dd=ImageDraw.Draw(deco)
    dd.ellipse((S*.62,-S*.12,S*1.15,S*.42),fill=light(col,.55)[:3]+(90,)); dd.ellipse((-S*.2,S*.55,S*.35,S*1.1),fill=(255,255,255,70))
    img.alpha_composite(deco.filter(ImageFilter.GaussianBlur(8))); d=ImageDraw.Draw(img)
    # table line
    d.rectangle((0,S*.80,S,S),fill=mix(hexc(b2),(120,90,60),.12))
    accent=dark(col,.1) if sum(col[:3])<600 else dark(col,.45)
    cat_f=font(40,'Bold'); ctext(d,S/2,70,p['category'],cat_f,(90,70,50,255))
    cx=S/2
    if k in ('bottle','oil'):
        shadow(img,(cx-300,S*.76,cx+300,S*.86),40)
        gl=Image.new('RGBA',(S,S),(0,0,0,0)); gd=ImageDraw.Draw(gl)
        bx0,bx1,by0,by1=cx-250,cx+250,S*.30,S*.82
        liquid=(light(col,.55) if k=='bottle' else col)
        gd.rounded_rectangle((cx-70,S*.17,cx+70,S*.32),20,fill=(235,245,242,200),outline=(170,190,185,255),width=6)
        gd.rounded_rectangle((bx0,by0,bx1,by1),90,fill=(240,248,246,190) if k=='bottle' else mix(col,(90,60,20),.25)[:3]+(220,),outline=(160,185,180,255),width=8)
        gd.rounded_rectangle((bx0+22,by0+170,bx1-22,by1-22),70,fill=liquid[:3]+(200,))
        gd.rounded_rectangle((bx0+40,by0+40,bx0+80,by1-60),20,fill=(255,255,255,110))
        img.alpha_composite(gl); d=ImageDraw.Draw(img)
        rr(d,(cx-90,S*.10,cx+90,S*.19),22,fill=hexc('#8a5a32'),outline=hexc('#5a3a20'),width=5)
        for i in range(4): d.line((cx-70,S*.115+i*30,cx+70,S*.115+i*30),fill=hexc('#6e4626'),width=3)
        label(img,(cx-215,S*.44,cx+215,S*.70),p,accent)
        # sprig/bowl on side
        shadow(img,(cx+230,S*.79,cx+560,S*.86),25)
        ImageDraw.Draw(img).ellipse((cx+230,S*.685,cx+560,S*.845),fill=hexc('#efe6d6'),outline=hexc('#bfae94'),width=5)
        texture(img,(cx+250,S*.70,cx+540,S*.83),col,tex if tex not in ('oil','honey') else 'seeds',p['productNumber']+7)
    elif k=='jar':
        shadow(img,(cx-340,S*.76,cx+340,S*.87),40)
        d.rounded_rectangle((cx-300,S*.30,cx+300,S*.82),70,fill=col,outline=dark(col,.35),width=8)
        d.rounded_rectangle((cx-270,S*.34,cx-220,S*.78),20,fill=light(col,.35))
        rr(d,(cx-320,S*.20,cx+320,S*.31),30,fill=hexc('#6a4424'),outline=hexc('#4a2e18'),width=6)
        label(img,(cx-230,S*.42,cx+230,S*.70),p,accent)
    elif k=='tea':
        # pouch behind + cup front
        pouch(img,(cx-360,S*.16,cx+200,S*.80),p,col,accent)
        d=ImageDraw.Draw(img)
        shadow(img,(cx+60,S*.78,cx+600,S*.88),30)
        d.ellipse((cx+80,S*.74,cx+600,S*.86),fill=(248,244,236,255),outline=(200,190,175,255),width=5)
        d.pieslice((cx+150,S*.50,cx+530,S*.86),0,180,fill=(250,248,242,255),outline=(200,190,175,255),width=5)
        d.rectangle((cx+150,S*.60,cx+530,S*.68),fill=(250,248,242,255))
        d.line((cx+150,S*.60,cx+150,S*.68),fill=(200,190,175,255),width=5); d.line((cx+530,S*.60,cx+530,S*.68),fill=(200,190,175,255),width=5)
        d.arc((cx+490,S*.62,cx+600,S*.74),-90,90,fill=(200,190,175,255),width=14)
        tea=mix(col,(150,60,20),.35) if tex!='powder' else col
        d.ellipse((cx+150,S*.57,cx+530,S*.63),fill=tea,outline=(200,190,175,255),width=5)
        d.ellipse((cx+220,S*.585,cx+330,S*.605),fill=light(tea,.3))
        ImageDraw.Draw(img).ellipse((cx-580,S*.705,cx-240,S*.875),fill=hexc('#efe6d6'),outline=hexc('#bfae94'),width=5)
        texture(img,(cx-560,S*.72,cx-260,S*.86),col,tex,p['productNumber'])
    elif k=='powder':
        pouch(img,(cx-420,S*.14,cx+120,S*.78),p,col,accent)
        bowl(img,(cx+30,S*.60,cx+620,S*.86),col,'powder',p['productNumber'])
    else:
        pouch(img,(cx-300,S*.13,cx+300,S*.76),p,col,accent,window=(col,tex))
        bowl(img,(cx+160,S*.66,cx+640,S*.88),col,tex,p['productNumber'])
    d=ImageDraw.Draw(img)
    ut=unit_text(p)
    if ut: ctext(d,S/2,S*.92,ut,font(40,'Bold'),(90,70,50,255))
    return img.convert('RGB').resize((800,800),Image.LANCZOS)

def pouch(img,box,p,col,accent,window=None):
    x0,y0,x1,y1=box; cx=(x0+x1)/2; w=x1-x0
    shadow(img,(x0+20,y1-50,x1-20,y1+40),35)
    d=ImageDraw.Draw(img)
    kraft=hexc('#d8b98a')
    d.polygon([(x0+30,y0+60),(x1-30,y0+60),(x1,y1),(x0,y1)],fill=kraft,outline=hexc('#a8845a'))
    d.rectangle((x0+30,y0,x1-30,y0+70),fill=hexc('#cfae7c'))
    for i in range(0,int(w-60),18): d.line((x0+30+i,y0+10,x0+30+i,y0+40),fill=hexc('#b89466'),width=3)
    d.rectangle((x0+30,y0+58,x1-30,y0+72),fill=accent)
    # paper grain
    rnd=random.Random(p['productNumber'])
    for i in range(600):
        x=rnd.uniform(x0+20,x1-20); y=rnd.uniform(y0+80,y1-10); d.point((x,y),fill=hexc('#c4a070'))
    lb=(x0+60,y0+130,x1-60,y0+130+(y1-y0)*.42)
    label(img,lb,p,accent)
    if window:
        wy0=lb[3]+40; texture(img,(cx-w*.3,wy0,cx+w*.3,min(y1-40,wy0+(y1-y0)*.26)),window[0],window[1],p['productNumber']+3)

def bowl(img,box,col,tex,seed):
    x0,y0,x1,y1=box; w=x1-x0; h=y1-y0
    shadow(img,(x0,y1-h*.25,x1,y1+h*.1),30)
    d=ImageDraw.Draw(img)
    d.pieslice((x0,y0-h*.2,x1,y1),0,180,fill=hexc('#efe6d6'),outline=hexc('#bfae94'),width=5)
    d.ellipse((x0,y0+h*.12,x1,y0+h*.5),fill=hexc('#e2d6c2'),outline=hexc('#bfae94'),width=5)
    texture(img,(x0+18,y0+h*.14,x1-18,y0+h*.48),col,tex,seed)
    if tex=='powder':
        d=ImageDraw.Draw(img); mx=(x0+x1)/2
        d.pieslice((mx-w*.3,y0-h*.1,mx+w*.3,y0+h*.55),180,360,fill=col)
        rnd=random.Random(seed)
        for i in range(500):
            a=rnd.uniform(math.pi,2*math.pi); r=rnd.random()
            x=mx+math.cos(a)*w*.3*r; y=y0+h*.225+math.sin(a)*h*.32*r
            c=light(col,rnd.uniform(0,.2)); d.ellipse((x-3,y-3,x+3,y+3),fill=c)

if __name__=='__main__':
    ps=json.load(open(sys.argv[1])); out=sys.argv[2]; os.makedirs(out,exist_ok=True)
    for p in ps:
        im=draw(p); base=os.path.join(out,f"{p['productNumber']:03d}")
        im.save(base+'.webp',quality=84)
        for s in (300,500,800): im.resize((s,s),Image.LANCZOS).save(f"{base}-{s}.webp",quality=80)
        print(base)
