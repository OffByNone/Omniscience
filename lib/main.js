var deviceLocatorService;
var httpServer;
/**
 * extension startup
 */

exports.main = function main() {
	const { storage } = require('sdk/simple-storage'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/simple-storage

    const { Tab } = require("./UI/Tab");
    const { Factory } = require('./Factories/Factory');
    const { DeviceLocatorServiceFactory } = require('./Factories/DeviceLocatorServiceFactory');
    const { UIFactory } = require('./Factories/UIFactory');

    var factory = new Factory();
    var uiFactory = new UIFactory();
    var deviceLocatorServiceFactory = new DeviceLocatorServiceFactory();
    var panel = uiFactory.createPanel();
    var button = uiFactory.createButton();
    var tab = uiFactory.createTab();

    panel.on('hide', () => button.check(false) );
    panel.on('openFocusTab', () => tab.openFocus() );
    tab.on("loadDevices", () => {
        deviceLocatorService.devices.forEach(device => {
            tab.emit('deviceFound', device);
        });
    });

	const HTTPServer = require("./libs/fxos-web-server/http-server");

	httpServer = new HTTPServer(5635);

	httpServer.addEventListener('request', function(evt) {
		var request  = evt.request;
		var response = evt.response;
		//request.headers.HOST will be ip address with port of current server !!
		console.log(request);
		response.send(templateString);
	});
	httpServer.start();

    button.on('change', (state) => {
        if (state.checked) {
            //panel.show( { position: button.getButton() } );
            deviceLocatorService.search();
            tab.openFocus();
        }
    });

    deviceLocatorService = deviceLocatorServiceFactory.createDeviceLocatorService();
	deviceLocatorService.devices = storage.devices || [];
    deviceLocatorService.devices.forEach(device => {
        panel.emit('deviceFound', device);
        tab.emit('deviceFound', device);
    });

	deviceLocatorService.search();

	deviceLocatorService.on('deviceLost', (device) => {
        panel.emit('deviceLost', device);
        tab.emit('deviceLost', device);
		storage.devices = deviceLocatorService.devices;
	});

    const notifications = require('sdk/notifications'); // https://developer.mozilla.org/en-US/Add-ons/SDK/High-Level_APIs/notifications
	deviceLocatorService.on('deviceFound', (device, isNew) => {
		if(isNew && false) {

            notifications.notify({
                title: 'Found ' + device.name,
                text: "a " + device.model.name + " by " + device.manufacturer.name,
                iconURL: device.icons.length > 0 && device.icons[0].url ? device.icons[0].url.href : ""
            });
        }

        panel.emit('deviceFound', device);
        tab.emit('deviceFound', device);
		storage.devices = deviceLocatorService.devices;
	});
};
/**
 * extension shutdown
 */
exports.onUnload = function onUnload() {
	if(deviceLocatorService && typeof deviceLocatorService.stopSearch === "function")
        deviceLocatorService.stopSearch();
    if(httpServer && typeof httpServer.stop === 'function')
        httpServer.stop();
};



var templateString = `The Project Gutenberg EBook of Narrative and Lyric Poems (Second Series)
for Use in the Lower School, by Various

This eBook is for the use of anyone anywhere in the United States and most
other parts of the world at no cost and with almost no restrictions
whatsoever.  You may copy it, give it away or re-use it under the terms of
the Project Gutenberg License included with this eBook or online at
www.gutenberg.org.  If you are not located in the United States, you'll have
to check the laws of the country where you are located before using this ebook.



	Title: Narrative and Lyric Poems (Second Series) for Use in the Lower School

	Author: Various

	Annotator: Orlando John Stevenson

Release Date: March 13, 2015 [EBook #48484]

	Language: English


*** START OF THIS PROJECT GUTENBERG EBOOK NARRATIVE AND LYRIC POEMS ***




Produced by David T. Jones, Mardi Desjardins and the online
Distributed Proofreaders Canada team at
	http://www.pgdpcanada.net






Transcriber's note:
      Text enclosed by underscores is in italics (_italics_).
      Text enclosed by equal signs is in bold face (=bold=).



                          NARRATIVE AND LYRIC


                                 POEMS
                            (SECOND SERIES)


                      FOR USE IN THE LOWER SCHOOL



                          WITH ANNOTATIONS BY

                     O. J. STEVENSON, M.A., D.PAED.

         _Professor of English, Ontario Agricultural College._






                                TORONTO
                    THE COPP, CLARK COMPANY, LIMITED




     Copyright, Canada, 1914, by THE COPP, CLARK COMPANY, LIMITED,
                           Toronto, Ontario.




                                PREFACE.

   The Narrative and Lyric Poems contained in this volume are the Second
Series prescribed by the Department of Education for examination for
Junior and Senior Public School Diplomas, and for the Senior High School
Entrance, and Entrance into the Model Schools. (Circular 58.)

   The poems are arranged in the order in which they are named in the
prescribed list issued by the Department of Education, and a division is
made between those prescribed for the Junior and those prescribed for
the Senior examination.

   In the annotations the chief points of difficulty have been
explained. In the case of certain poems, such as Tennyson’s _Enid_, for
example, some minor changes in words and phrases were made in the later
editions of the poet’s works. In the cases where the later editions are
still in copyright, the earlier readings have in all cases been
followed, and important changes are indicated in the notes.




                              =CONTENTS.=


     _The numbers in parentheses refer to the pages of the Notes._


                                   A

   The poems in the following list are those prescribed by the
Department of Education, in the Province of Ontario, for examination for
the =Junior Public School Diploma=. In addition to these poems Scott’s
_Quentin Durward_ is also prescribed for this examination. See Circular
58.

                                                                  PAGE
    _Tennyson_      Enoch Arden                             (133)    1

    _Tennyson_       Morte D’Arthur                         (137)   30

    _Byron_          The Prisoner of Chillon                (140)   38

    _Gray_           Elegy, Written in a Country Churchyard (143)   50

    _Mrs. Browning_  My Kate                                (145)   55

    _Scott_          Rosabelle                              (145)   57

    _Scott_          Lochinvar                              (146)   58

    _Shelley_        To a Skylark                           (147)   60


                                   B

   The poems in the following list are those prescribed by the
Department of Education in the Province of Ontario, for examination for
the =Senior Public School Diploma, Senior High School Entrance, and
Entrance into the Model Schools=. In addition to these poems,
Shakespeare’s _The Merchant of Venice_ is also prescribed for this
examination. See Circular 58.

                                                                  PAGE
    _Tennyson_  Enid                                       (148)    64

    _Tennyson_  Ode on the Death of the Duke of Wellington (151 )   90

    _Tennyson_  The Day Dream                              (153)    99

    _Tennyson_  “You Ask Me, Why—”                         (156)   106

    _Goldsmith_ The Traveller                              (156)   107

    _Browning_  Home-Thoughts, from the Sea                (164)   120

    _Browning_  The Patriot                                (165)   121

    _Browning_  Love Among the Ruins                       (166)   122

    _Byron_     The Isles of Greece                        (167)   125

    _Clough_    “As Ships, Becalm’d—”                      (169)   129

    _Holmes_    The Chambered Nautilus                     (169)   130

                List of Selections for Memorization                132




                       NARRATIVE AND LYRIC POEMS

                            _SECOND SERIES_




                             =ENOCH ARDEN.=


  Long lines of cliff breaking have left a chasm;
  And in the chasm are foam and yellow sands;
  Beyond, red roofs about a narrow wharf
  In cluster; then a moulder’d church; and higher
  A long street climbs to one tall-tower’d mill;          5
  And high in heaven behind it a gray down
  With Danish barrows; and a hazelwood,
  By autumn nutters haunted, flourishes
  Green in a cuplike hollow of the down.

    Here on this beach a hundred years ago,          10
  Three children of three houses, Annie Lee,
  The prettiest little damsel in the port,
  And Philip Ray the miller’s only son,
  And Enoch Arden, a rough sailor’s lad
  Made orphan by a winter shipwreck, play’d          15
  Among the waste and lumber of the shore,
  Hard coils of cordage, swarthy fishing-nets,
  Anchors of rusty fluke, and boats updrawn;
  And built their castles of dissolving sand
  To watch them overflow’d, or following up          20
  And flying the white breaker, daily left
  The little footprint daily wash’d away.

    A narrow cave ran in beneath the cliff:
  In this the children play’d at keeping house.
  Enoch was host one day, Philip the next,          25
  While Annie still was mistress; but at times
  Enoch would hold possession for a week:
  ‘This is my house and this my little wife.’
  ‘Mine too,’ said Philip ‘turn and turn about:’
  When, if they quarrell’d, Enoch stronger-made          30
  Was master: then would Philip, his blue eyes
  All flooded with the helpless wrath of tears,
  Shriek out ‘I hate you, Enoch,’ and at this
  The little wife would weep for company,
  And pray them not to quarrel for her sake,          35
  And say she would be little wife to both.

    But when the dawn of rosy childhood past,
  And the new warmth of life’s ascending sun
  Was felt by either, either fixt his heart
  On that one girl; and Enoch spoke his love,          40
  But Philip loved in silence; and the girl
  Seem’d kinder unto Philip than to him;
  But she loved Enoch; tho’ she knew it not,
  And would if asked deny it. Enoch set
  A purpose evermore before his eyes,          45
  To hoard all savings to the uttermost,
  To purchase his own boat, and make a home
  For Annie: and so prosper’d that at last
  A luckier or a bolder fisherman,
  A carefuller in peril, did not breathe          50
  For leagues along that breaker-beaten coast
  Than Enoch. Likewise had he served a year
  On board a merchantman, and made himself
  Full sailor; and he thrice had pluck’d a life
  From the dread sweep of the downstreaming seas:          55
  And all men look’d upon him favourably:
  And ere he touch’d his one and-twentieth May
  He purchased his own boat, and made a home
  For Annie, neat and nest-like, halfway up
  The narrow street that clamber’d toward the mill.          60

    Then, on a golden autumn eventide,
  The younger people making holiday,
  With bag and sack and basket, great and small
  Went nutting to the hazels. Philip stay’d
  (His father lying sick and needing him)          65
  An hour behind; but as he climbed the hill,
  Just where the prone edge of the wood began
  To feather toward the hollow, saw the pair,
  Enoch and Annie, sitting hand-in-hand,
  His large gray eyes and weather-beaten face          70
  All kindled by a still and sacred fire,
  That burn’d as on an altar. Philip look’d,
  And in their eyes and faces read his doom;
  Then, as their faces drew together, groan’d;
  And slipt aside, and like a wounded life          75
  Crept down into the hollows of the wood;
  There, while the rest were loud in merrymaking,
  Had his dark hour unseen, and rose and past
  Bearing a lifelong hunger in his heart.

    So these were wed, and merrily rang the bells,          80
  And merrily ran the years, seven happy years,
  Seven happy years of health and competence,
  And mutual love and honourable toil;
  With children; first a daughter. In him woke,
  With his first babe’s first cry, the noble wish          85
  To save all earnings to the uttermost,
  And give his child a better bringing up
  Than his had been, or hers; a wish renew’d,
  When two years after came a boy to be
  The rosy idol of her solitudes,          90
  While Enoch was abroad on wrathful seas,
  Or often journeying landward; for in truth
  Enoch’s white horse, and Enoch’s ocean-spoil
  In ocean-smelling osier and his face,
  Rough-redden’d with a thousand winter gales,          95
  Not only to the market-cross were known,
  But in the leafy lanes behind the down,
  Far as the portal-warding lion-whelp,
  And peacock-yewtree of the lonely Hall,
  Whose Friday fare was Enoch’s ministering.          100

    Then came a change, as all things human change.
  Ten miles to northward of the narrow port
  Open’d a larger haven: thither used
  Enoch at times to go by land or sea;
  And once when there, and clambering on a mast          105
  In harbour, by mischance he slipt and fell:
  A limb was broken when they lifted him;
  And while he lay recovering there, his wife
  Bore him another son, a sickly one:
  Another hand crept too across his trade          110
  Taking her bread and theirs: and on him fell,
  Altho’ a grave and staid God-fearing man,
  Yet lying thus inactive, doubt and gloom.
  He seem’d, as in a nightmare of the night,
  To see his children leading evermore          115
  Low miserable lives of hand-to-mouth,
  And her, he loved, a beggar: then he pray’d
  ‘Save them from this, whatever comes to me.’
  And while he pray’d, the master of that ship
  Enoch had served in, hearing his mischance,          120
  Came, for he knew the man and valued him,
  Reporting of his vessel China-bound,
  And wanting yet a boatswain. Would he go?
  There yet were many weeks before she sail’d,
  Sail’d from this port. Would Enoch have the place?          125
  And Enoch all at once assented to it,
  Rejoicing at that answer to his prayer.

    So now that shadow of mischance appear’d
  No graver than as when some little cloud
  Cuts off the fiery highway of the sun,          130
  And isles a light in the offing: yet the wife—
  When he was gone—the children—what to do?
  Then Enoch lay long-pondering on his plans;
  To sell the boat—and yet he loved her well—
  How many a rough sea had he weathered in her!          135
  He knew her, as a horseman knows his horse—
  And yet to sell her—then with what she brought
  Buy goods and stores—set Annie forth in trade
  With all that seamen needed or their wives—
  So might she keep the house while he was gone.          140
  Should he not trade himself out yonder? go
  This voyage more than once? yea, twice or thrice—
  As oft as needed—last, returning rich,
  Become the master of a larger craft,
  With fuller profits lead an easier life,          145
  Have all his pretty young ones educated,
  And pass his days in peace among his own.

    Thus Enoch in his heart determined all:
  Then moving homeward came on Annie pale,
  Nursing the sickly babe, her latest-born.          150
  Forward she started with a happy cry,
  And laid the feeble infant in his arms;
  Whom Enoch took, and handled all his limbs,
  Appraised his weight and fondled fatherlike,
  But had no heart to break his purposes          155
  To Annie, till the morrow, when he spoke.

    Then first since Enoch’s golden ring had girt
  Her finger, Annie fought against his will:
  Yet not with brawling opposition she,
  But manifold entreaties, many a tear,          160
  Many a sad kiss by day or night renew’d
  (Sure that all evil would come out of it)
  Besought him, supplicating, if he cared
  For her or his dear children, not to go.
  He not for his own self caring but her,          165
  Her and her children, let her plead in vain;
  So grieving held his will, and bore it thro.’

    For Enoch parted with his old sea-friend,
  Bought Annie goods and stores, and set his hand
  To fit their little streetward sitting-room          170
  With shelf and corner for the goods and stores.
  So all day long till Enoch’s last at home,
  Shaking their pretty cabin, hammer and axe,
  Auger and saw, while Annie seem’d to hear
  Her own death-scaffold raising, shrill’d and rang          175
  Till this was ended, and his careful hand,—
  The space was narrow,—having order’d all
  Almost as neat and close as nature packs
  Her blossom or her seedling, paused; and he,
  Who needs would work for Annie to the last,          180
  Ascending tired, heavily slept till morn.

    And Enoch faced this morning of farewell
  Brightly and boldly. All his Annie’s fears,
  Save as his Annie’s, were a laughter to him.
  Yet Enoch as a brave God-fearing man          185
  Bow’d himself down, and in that mystery
  Where God-in-man is one with man-in-God,
  Pray’d for a blessing on his wife and babes
  Whatever came to him: and then he said
  ‘Annie, this voyage by the grace of God          190
  Will bring fair weather yet to all of us.
  Keep a clean hearth and a clear fire for me,
  For I’ll be back, my girl, before you know it.’
  Then lightly rocking baby’s cradle ‘and he,
  This pretty, puny, weakly little one,—          195
  Nay—for I love him all the better for it—
  God bless him, he shall sit upon my knees
  And I will tell him tales of foreign parts,
  And make him merry, when I come home again.
  Come Annie, come, cheer up before I go.’          200

    Him running on thus hopefully she heard,
  And almost hoped herself; but when he turn’d
  The current of his talk to greater things
  In sailor fashion roughly sermonizing
  On providence and trust in Heaven, she heard,          205
  Heard and not heard him; as the village girl,
  Who sets her pitcher underneath the spring,
  Musing on him that used to fill it for her,
  Hears and not hears, and lets it overflow.

    At length she spoke ‘O Enoch, you are wise;          210
  And yet for all your wisdom well know I
  That I shall look upon your face no more.’

    ‘Well then,’ said Enoch, ‘I shall look on yours.
  Annie, the ship I sail in passes here
  (He named the day) get you a seaman’s glass,          215
  Spy out my face, and laugh at all your fears.’

    But when the last of those last moments came,
  ‘Annie, my girl, cheer up, be comforted,
  Look to the babes, and till I come again,
  Keep everything shipshape, for I must go.          220
  And fear no more for me; or if you fear
  Cast all your cares on God; that anchor holds.
  Is He not yonder in those uttermost
  Parts of the morning? if I flee to these
  Can I go from Him? and the sea is His,          225
  The sea is His: He made it.’

                                    Enoch rose,
  Cast his strong arms about his drooping wife,
  And kiss’d his wonder-stricken little ones;
  But for the third, the sickly one, who slept          230
  After a night of feverous wakefulness,
  When Annie would have raised him Enoch said
  ‘Wake him not; let him sleep; how should the child
  Remember this?’ and kiss’d him in his cot.
  But Annie from her baby’s forehead clipt          235
  A tiny curl, and gave it: this he kept
  Thro’ all his future; but now hastily caught
  His bundle, waved his hand, and went his way.

    She, when the day, that Enoch mention’d, came,
  Borrow’d a glass, but all in vain: perhaps          240
  She could not fix the glass to suit her eye;
  Perhaps her eye was dim, hand tremulous;
  She saw him not: and while he stood on deck
  Waving, the moment and the vessel past.

    Ev’n to the last dip of the vanishing sail          245
  She watch’d it, and departed weeping for him;
  Then, tho’ she mourned his absence as his grave,
  Set her sad will no less to chime with his,
  But throve not in her trade, not being bred
  To barter, nor compensating the want          250
  By shrewdness, neither capable of lies,
  Nor asking overmuch and taking less,
  And still foreboding ‘what would Enoch say?’
  For more than once, in days of difficulty
  And pressure, had she sold her wares for less          255
  Than what she gave in buying what she sold:
  She failed and sadden’d knowing it; and thus,
  Expectant of that news which never came,
  Gain’d for her own a scanty sustenance,
  And lived a life of silent melancholy.          260

    Now the third child was sickly-born and grew
  Yet sicklier, tho’ the mother cared for it
  With all a mother’s care: nevertheless,
  Whether her business often called her from it,
  Or thro’ the want of what it needed most,          265
  Or means to pay the voice who best could tell
  What most it needed—howsoe’er it was,
  After a lingering,—ere she was aware,—
  Like the caged bird escaping suddenly,
  The little innocent soul flitted away.          270

    In that same week when Annie buried it,
  Philip’s true heart, which hunger’d for her peace
  (Since Enoch left he had not look’d upon her),
  Smote him, as having kept aloof so long.
  ‘Surely’ said Philip ‘I may see her now,          275
  May be some little comfort;’ therefore went,
  Past thro’ the solitary room in front,
  Paused for a moment at an inner door,
  Then struck it thrice, and, no one opening,
  Enter’d; but Annie, seated with her grief,          280
  Fresh from the burial of her little one,
  Cared not to look on any human face,
  But turn’d her own toward the wall and wept.
  Then Philip standing up said falteringly
  ‘Annie, I come to ask a favour of you.’          285

    He spoke; the passion in her moan’d reply
  ‘Favour from one so sad and so forlorn
  As I am!’ half abashed him; yet unask’d,
  His bashfulness and tenderness at war,
  He set himself beside her, saying to her:          290
  ‘I came to speak to you of what he wished,
  Enoch, your husband: I have ever said
  You chose the best among us—a strong man:
  For where he fixt his heart he set his hand
  To do the thing he will’d, and bore it thro’.          295
  And wherefore did he go this weary way,
  And leave you lonely? not to see the world—
  For pleasure?—nay, but for the wherewithal
  To give his babes a better bringing-up
  Than his had been, or yours: that was his wish.          300
  And if he come again, vext will he be
  To find the precious morning hours were lost.
  And it would vex him even in his grave,
  If he could know his babes were running wild
  Like colts about the waste. So, Annie, now—          305
  Have we not known each other all our lives?
  I do beseech you by the love you bear
  Him and his children not to say me nay—
  For, if you will, when Enoch comes again
  Why then he shall repay me—if you will,          310
  Annie—for I am rich and well-to-do.
  Now let me put the boy and girl to school:
  This is the favour that I came to ask.’

    Then Annie with her brows against the wall
  Answer’d ‘I cannot look you in the face;          315
  I seem so foolish and so broken down.
  When you came in my sorrow broke me down;
  And now I think your kindness breaks me down;
  But Enoch lives; that is borne in on me:
  He will repay you: money can be repaid;          320
  Not kindness such as yours.’

                              And Philip ask’d
  ‘Then you will let me, Annie?’

                                    There she turn’d,
  She rose, and fixed her swimming eyes upon him,          325
  And dwelt a moment on his kindly face,
  Then calling down a blessing on his head
  Caught at his hand, and wrung it passionately,
  And past into the little garth beyond.
  So lifted up in spirit he moved away.          330

    Then Philip put the boy and girl to school,
  And bought them needful books, and everyway,
  Like one who does his duty by his own,
  Made himself theirs; and tho’ for Annie’s sake,
  Fearing the lazy gossip of the port,          335
  He oft denied his heart his dearest wish,
  And seldom crost her threshold, yet he sent
  Gifts by the children, garden-herbs and fruit,
  The late and early roses from his wall,
  Or conies from the down, and now and then,          340
  With some pretext of fineness in the meal
  To save the offence of charitable, flour
  From his tall mill that whistled on the waste.

    But Philip did not fathom Annie’s mind:
  Scarce could the woman when he came upon her,          345
  Out of full heart and boundless gratitude
  Light on a broken word to thank him with.
  But Philip was her children’s all-in-all;
  From distant corners of the street they ran
  To greet his hearty welcome heartily;          350
  Lords of his house and of his mill were they;
  Worried his passive ear with petty wrongs
  Or pleasures, hung upon him, play’d with him
  And call’d him Father Philip. Philip gain’d
  As Enoch lost; for Enoch seem’d to them          355
  Uncertain as a vision or a dream,
  Faint as a figure seen in early dawn
  Down at the far end of an avenue,
  Going we know not where: and so ten years,
  Since Enoch left his hearth and native land,          360
  Fled forward, and no news of Enoch came.

    It chanced one evening Annie’s children long’d
  To go with others, nutting to the wood,
  And Annie would go with them; then they begg’d
  For Father Philip (as they call’d him) too:          365
  Him, like the working bee in blossom-dust,
  Blanch’d with his mill, they found; and saying to him
  ‘Come with us father Philip’ he denied;
  But when the children pluck’d at him to go,
  He laugh’d and yielded readily to their wish,          370
  For was not Annie with them? and they went.

    But after scaling half the weary down,
  Just where the prone edge of the wood began
  To feather toward the hollow, all her force
  Fail’d her; and sighing ‘Let me rest’ she said;          375
  So Philip rested with her well-content;
  While all the younger ones with jubilant cries
  Broke from their elders, and tumultuously
  Down thro’ the whitening hazels made a plunge
  To the bottom, and dispersed, and bent or broke          380
  The lithe reluctant boughs to tear away
  Their tawny clusters, crying to each other
  And calling, here and there, about the wood.

    But Philip sitting at her side forgot
  Her presence, and remember’d one dark hour          385
  Here in this wood, when like a wounded life
  He crept into the shadow: at last he said
  Lifting his honest forehead, ‘Listen, Annie,
  How merry they are down yonder in the wood.’
  ‘Tired, Annie?’ for she did not speak a word.          390
  ‘Tired?’ but her face had fallen upon her hands;
  At which as with a kind of anger in him,
  ‘The ship was lost,’ he said, ‘the ship was lost!
  No more of that! why should you kill yourself
  And make them orphans quite?’ And Annie said          395
  ‘I thought not of it: but—I know not why—
  Their voices make me feel so solitary.’

    Then Philip coming somewhat closer spoke.
  ‘Annie, there is a thing upon my mind,
  And it has been upon my mind so long,          400
  That tho’ I know not when it first came there,
  I know that it will out at last. O Annie,
  It is beyond all hope, against all chance,
  That he who left you ten long years ago
  Should still be living; well then—let me speak:          405
  I grieve to see you poor and wanting help:
  I cannot help you as I wish to do
  Unless—they say that women are so quick—
  Perhaps you know what I would have you know—
  I wish you for my wife. I fain would prove          410
  A father to your children: I do think
  They love me as a father: I am sure
  That I love them as if they were mine own;
  And I believe, if you were fast my wife,
  That after all these sad uncertain years,          415
  We might be still as happy as God grants
  To any of His creatures. Think upon it:
  For I am well-to-do—no kin, no care,
  No burthen, save my care for you and yours:
  And we have known each other all our lives,          420
  And I have loved you longer than you know.’

    Then answer’d Annie; tenderly she spoke:
  ‘You have been as God’s good angel in our house.
  God bless you for it, God reward you for it,
  Philip, with something happier than myself.          425
  Can one love twice? can you be ever loved
  As Enoch was? what is it that you ask?’
  ‘I am content’ he answer’d ‘to be loved
  A little after Enoch.’ ‘O’ she cried
  Scared as it were ‘dear Philip, wait a while:          430
  If Enoch comes—but Enoch will not come—
  Yet wait a year, a year is not so long:
  Surely I shall be wiser in a year:
  O wait a little!’ Philip sadly said
  ‘Annie, as I have waited all my life          435
  I well may wait a little.’ ‘Nay’ she cried
  ‘I am bound: you have my promise—in a year:
  Will you not bide your year as I bide mine?’
  And Philip answer’d ‘I will bide my year.’

    Here both were mute, till Philip glancing up          440
  Beheld the dead flame of the fallen day
  Pass from the Danish barrow overhead;
  Then fearing night and chill for Annie, rose
  And sent his voice beneath him thro’ the wood.
  Up came the children laden with their spoil;          445
  Then all descended to the port, and there
  At Annie’s door he paused and gave his hand,
  Saying gently ‘Annie, when I spoke to you,
  That was your hour of weakness. I was wrong.
  I am always bound to you, but you are free.’          450
  Then Annie weeping answer’d ‘I am bound.’

    She spoke; and in one moment as it were,
  While yet she went about her household ways,
  Ev’n as she dwelt upon his latest words,
  That he had lov’d her longer than she knew,          455
  That autumn into autumn flash’d again,
  And there he stood once more before her face,
  Claiming her promise. ‘Is it a year?’ she ask’d.
  ‘Yes, if the nuts’ he said ‘be ripe again:
  Come out and see.’ But she—she put him off—          460
  So much to look to—such a change—a month—
  Give her a month—she knew that she was bound—
  A month—no more. Then Philip with his eyes
  Full of that lifelong hunger, and his voice
  Shaking a little like a drunkard’s hand,          465
  ‘Take your own time, Annie, take your own time.’
  And Annie could have wept for pity of him;
  And yet she held him on delayingly
  With many a scarce-believable excuse,
  Trying his truth and his long-sufferance,          470
  Till half-another year had slipped away.

    By this the lazy gossips of the port,
  Abhorrent of a calculation crost
  Began to chafe as at a personal wrong.
  Some thought that Philip did but trifle with her;          475
  Some that she but held off to draw him on;
  And others laugh’d at her and Philip too,
  As simple folk that knew not their own minds;
  And one, in whom all evil fancies clung
  Like serpent eggs together, laughingly          480
  Would hint at worse in either. Her own son
  Was silent, tho’ he often look’d his wish;
  But evermore the daughter prest upon her
  To wed the man so dear to all of them
  And lift the household out of poverty;          485
  And Philip’s rosy face contracting grew
  Careworn and wan; and all these things fell on her
  Sharp as reproach.

                      At last one night it chanced
  That Annie could not sleep, but earnestly          490
  Pray’d for a sign ‘my Enoch is he gone?’
  Then compass’d round by the blind wall of night
  Brook’d not the expectant terror of her heart,
  Started from bed, and struck herself a light,
  Then desperately seized the holy Book,          495
  Suddenly set it wide to find a sign,
  Suddenly put her finger on the text,
  ‘Under a palmtree.’ That was nothing to her:
  No meaning there: she closed the Book and slept:
  When lo! her Enoch sitting on a height,          500
  Under a palmtree, over him the Sun:
  ‘He is gone,’ she thought, ‘he is happy, he is singing
  Hosanna in the highest: yonder shines
  The Sun of Righteousness, and these be palms
  Whereof the happy people strowing cried          505
  “Hosanna in the highest!”’ Here she woke,
  Resolved, sent for him and said wildly to him
  ‘There is no reason why we should not wed.’
  ‘Then for God’s sake,’ he answer’d, ‘both our sakes,
  So you will wed me, let it be at once.’          510

    So these were wed and merrily rang the bells,
  Merrily rang the bells and they were wed.
  But never merrily beat Annie’s heart.
  A footstep seem’d to fall beside her path,
  She knew not whence; a whisper on her ear,          515
  She knew not what; nor loved she to be left
  Alone at home nor ventured out alone.
  What ail’d her then, that ere she enter’d, often
  Her hand dwelt lingeringly on the latch,
  Fearing to enter: Philip thought he knew:          520
  Such doubts and fears were common to her state,
  Being with child: but when her child was born,
  Then her new child was as herself renew’d,
  Then the new mother came about her heart,
  Then her good Philip was her all-in-all,          525
  And that mysterious instinct wholly died.

    And where was Enoch? prosperously sail’d
  The ship ‘Good Fortune,’ tho’ at setting forth
  The Biscay, roughly ridging eastward, shook
  And almost overwhelm’d her, yet unvext          530
  She slipt across the summer of the world,
  Then after a long tumble about the Cape
  And frequent interchange of foul and fair,
  She passing thro’ the summer world again,
  The breath of heaven came continually          535
  And sent her sweetly by the golden isles,
  Till silent in her oriental haven.

    There Enoch traded for himself, and bought
  Quaint monsters for the market of those times,
  A gilded dragon also for the babes.          540

    Less lucky her home-voyage: at first indeed
  Thro’ many a fair sea-circle, day by day,
  Scarce-rocking, her full-busted figure-head
  Stared o’er the ripple feathering from her bows:
  Then follow’d calms, and then winds variable,          545
  Then baffling, a long course of them; and last
  Storm, such as drove her under moonless heavens
  Till hard upon the cry of ‘breakers’ came
  The crash of ruin, and the loss of all
  But Enoch and two others. Half the night,          550
  Buoy’d upon floating tackle and broken spars,
  These drifted, stranding on an isle at morn
  Rich, but the loneliest in a lonely sea.

    No want was there of human sustenance,
  Soft fruitage, mighty nuts, and nourishing roots;          555
  Nor save for pity was it hard to take
  The helpless life so wild that it was tame.
  There in a seaward-gazing mountain-gorge
  They built, and thatch’d with leaves of palm, a hut,
  Half hut, half native cavern. So the three,          560
  Set in this Eden of all plenteousness,
  Dwelt with eternal summer, ill-content.

    For one, the youngest, hardly more than boy,
  Hurt in that night of sudden ruin and wreck,
  Lay lingering out a three years’ death-in-life.          565
  They could not leave him. After he was gone,
  The two remaining found a fallen stem;
  And Enoch’s comrade, careless of himself,
  Fire-hollowing this in Indian fashion, fell
  Sun-stricken, and that other lived alone.          570
  In those two deaths he read God’s warning ‘wait.’

    The mountain wooded to the peak, the lawns
  And winding glades high up like ways to Heaven,
  The slender coco’s drooping crown of plumes,
  The lightning flash of insect and of bird,          575
  The lustre of the long convolvuluses
  That coil’d around the stately stems, and ran
  Ev’n to the limit of the land, the glows
  And glories of the broad belt of the world,
  All these he saw; but what he fain had seen          580
  He could not see, the kindly human face,
  Nor ever hear a kindly voice, but heard
  The myriad shriek of wheeling ocean-fowl,
  The league-long roller thundering on the reef,
  The moving whisper of huge trees that branch’d          585
  And blossom’d in the zenith, or the sweep
  Of some precipitous rivulet to the wave,
  As down the shore he ranged, or all day long
  Sat often in the seaward-gazing gorge,
  A shipwreck’d sailor, waiting for a sail:          590
  No sail from day to day, but every day
  The sunrise broken into scarlet shafts
  Among the palms and ferns and precipices;
  The blaze upon the waters to the east;
  The blaze upon his island overhead;          595
  The blaze upon the waters to the west;
  Then the great stars that globed themselves in Heaven,
  The hollower-bellowing ocean, and again
  The scarlet shafts of sunrise—but no sail.

    There often as he watch’d or seem’d to watch,          600
  So still, the golden lizard on him paused,
  A phantom made of many phantoms moved
  Before him haunting him, or he himself
  Moved haunting people, things and places, known
  Far in a darker isle beyond the line;          605
  The babes, their babble, Annie, the small house,
  The climbing street, the mill, the leafy lanes,
  The peacock-yewtree and the lonely Hall,
  The horse he drove, the boat he sold, the chill
  November dawns and dewy-glooming downs,          610
  The gentle shower, the smell of dying leaves,
  And the low moan of leaden-colour’d seas.

    Once likewise, in the ringing of his ears,
  Tho’ faintly, merrily—far and far away—
  He heard the pealing of his parish bells;          615
  Then, tho’ he knew not wherefore, started up
  Shuddering, and when the beauteous hateful isle
  Return’d upon him, had not his poor heart
  Spoken with That, which being everywhere
  Lets none, who speaks with Him, seem all alone,          620
  Surely the man had died of solitude.

    Thus over Enoch’s early-silvering head
  The sunny and rainy seasons came and went
  Year after year. His hopes to see his own,
  And pace the sacred old familiar fields,          625
  Not yet had perished, when his lonely doom
  Came suddenly to an end. Another ship
  (She wanted water) blown by baffling winds,
  Like the Good Fortune, from her destined course,
  Stay’d by this isle, not knowing where she lay:          630
  For since the mate had seen at early dawn
  Across a break on the mist-wreathen isle
  The silent water slipping from the hills,
  They sent a crew that landing burst away
  In search of stream or fount, and fill’d the shores          635
  With clamour. Downward from his mountain gorge
  Stept the long-hair’d, long-bearded solitary,
  Brown, looking hardly human, strangely clad,
  Muttering and mumbling, idiotlike it seem’d,
  With inarticulate rage, and making signs          640
  They knew not what: and yet he led the way
  To where the rivulets of sweet water ran;
  And ever as he mingled with the crew,
  And heard them talking, his long-bounden tongue
  Was loosen’d, till he made them understand;          645
  Whom, when their casks were fill’d they took aboard:
  And there the tale he utter’d brokenly,
  Scarce credited at first but more and more,
  Amazed and melted all who listen’d to it:
  And clothes they gave him and free passage home;          650
  But oft he work’d among the rest and shook
  His isolation from him. None of these
  Came from his county, or could answer him,
  If question’d, aught of what he cared to know.
  And dull the voyage was with long delays,          655
  The vessel scarce sea-worthy; but evermore
  His fancy fled before the lazy wind
  Returning, till beneath a clouded moon
  He like a lover down thro’ all his blood
  Drew in the dewy meadowy morning-breath          660
  Of England, blown across her ghostly wall:
  And that same morning officers and men
  Levied a kindly tax upon themselves,
  Pitying the lonely man and gave him it:
  Then moving up the coast they landed him,          665
  Ev’n in that harbour whence he sail’d before.

    There Enoch spoke no word to anyone,
  But homeward—home—what home? had he a home?
  His home, he walk’d. Bright was that afternoon,
  Sunny but chill; till drawn thro’ either chasm,          670
  Where either haven open’d on the deeps,
  Roll’d a sea-haze and whelm’d the world in gray;
  Cut off the length of highway on before,
  And left but narrow breadth to left and right
  Of wither’d holt or tilth or pasturage.          675
  On the nigh-naked tree the robin piped
  Disconsolate, and thro’ the dripping haze
  The dead weight of the dead leaf bore it down:
  Thicker the drizzle grew, deeper the gloom;
  Last, as it seem’d, a great mist-blotted light          680
  Flared on him, and he came upon the place.

    Then down the long street having slowly stolen,
  His heart foreshadowing all calamity,
  His eyes upon the stones, he reach’d the home
  Where Annie lived and loved him, and his babes          685
  In those far-off seven happy years were born;
  But finding neither light nor murmur there
  (A bill of sale gleam’d thro’ the drizzle) crept
  Still downward thinking ‘dead or dead to me!’

    Down to the pool and narrow wharf he went,          690
  Seeking a tavern which of old he knew,
  A front of timber-crost antiquity,
  So propt, worm-eaten, ruinously old,
  He thought it must have gone; but he was gone
  Who kept it; and his widow, Miriam Lane,          695
  With daily-dwindling profits held the house;
  A haunt of brawling seamen once, but now
  Stiller, with yet a bed for wandering men.
  There Enoch rested silent many days.

    But Miriam Lane was good and garrulous,          700
  Nor let him be, but often breaking in,
  Told him with other annals of the port,
  Not knowing—Enoch was so brown, so bow’d
  So broken—all the story of his house.
  His baby’s death, her growing poverty,          705
  How Philip put her little ones to school,
  And kept them in it, his long wooing her,
  Her slow consent, and marriage, and the birth
  Of Philip’s child: and o’er his countenance
  No shadow past, nor motion: anyone,          710
  Regarding, well had deem’d he felt the tale
  Less than the teller: only when she closed
  ‘Enoch, poor man, was cast away and lost’
  He, shaking his gray head pathetically,
  Repeated muttering ‘cast away and lost;’          715
  Again in deeper inward whispers ‘lost!’

    But Enoch yearn’d to see her face again;
  ‘If I might look on her sweet face again
  And know that she is happy.’ So the thought
  Haunted and harass’d him, and drove him forth,          720
  At evening when the dull November day
  Was growing duller twilight, to the hill.
  There he sat down gazing on all below;
  There did a thousand memories roll upon him,
  Unspeakable for sadness. By and by          725
  The ruddy square of comfortable light,
  Far-blazing from the rear of Philip’s house,
  Allured him, as the beacon-blaze allures
  The bird of passage, till he madly strikes
  Against it, and beats out his weary life.          730

    For Philip’s dwelling fronted on the street,
  The latest house to landward; but behind,
  With one small gate that open’d on the waste,
  Flourish’d a little garden square and wall’d:
  And in it throve an ancient evergreen,          735
  A yewtree, and all around it ran a walk
  Of shingle, and a walk divided it:
  But Enoch shunn’d the middle walk and stole
  Up by the wall, behind the yew; and thence
  That which he better might have shunn’d, if griefs          740
  Like his have worse or better, Enoch saw.

    For cups and silver on the burnish’d board
  Sparkled and shone; so genial was the hearth:
  And on the right hand of the hearth he saw
  Philip, the slighted suitor of old times,          745
  Stout, rosy, with his babe across his knees;
  And o’er her second father stoopt a girl,
  A later but a loftier Annie Lee,
  Fair-hair’d and tall, and from her lifted hand
  Dangled a length of ribbon and a ring          750
  To tempt the babe, who rear’d his creasy arms,
  Caught at and ever miss’d it, and they laugh’d:
  And on the left hand of the hearth he saw
  The mother glancing often toward her babe,
  But turning now and then to speak with him,          755
  Her son, who stood beside her tall and strong,
  And saying that which pleased him, for he smiled.

    Now when the dead man come to life beheld
  His wife his wife no more, and saw the babe
  Hers, yet not his, upon the father’s knee,          760
  And all the warmth, the peace, the happiness,
  And his own children tall and beautiful,
  And him, that other, reigning in his place,
  Lord of his rights and of his children’s love,—
  Then he, tho’ Miriam Lane had told him all,          765
  Because things seen are mightier than things heard,
  Stagger’d and shook, holding the branch, and fear’d
  To send abroad a shrill and terrible cry,
  Which in one moment, like the blast of doom,
  Would shatter all the happiness of the hearth.          770

    He therefore turning softly like a thief,
  Lest the harsh shingle should grate underfoot,
  And feeling all along the garden-wall,
  Lest he should swoon and tumble and be found,
  Crept to the gate, and open’d it, and closed,          775
  As lightly as a sick man’s chamber-door,
  Behind him, and came out upon the waste.

    And there he would have knelt, but that his knees
  Were feeble, so that falling prone he dug
  His fingers into the wet earth, and pray’d.          780

    ‘Too hard to bear! why did they take me thence?
  O God Almighty, blessed Saviour, Thou
  That did’st uphold me on my lonely isle,
  Uphold me, Father, in my loneliness
  A little longer! aid me, give me strength          785
  Not to tell her, never to let her know.
  Help me not to break in upon her peace.
  My children too! must I not speak to these?
  They know me not. I should betray myself.
	Never: no father’s kiss for me—the girl          790
  So like her mother, and the boy, my son.’

    There speech and thought and nature fail’d a little,
  And he lay tranced; but when he rose and paced
  Back toward his solitary home again,
  All down the long and narrow street he went          795
  Beating it in upon his weary brain,
  As tho’ it were the burthen of a song,
  ‘Not to tell her, never to let her know.’

    He was not all unhappy. His resolve
  Upbore him, and firm faith, and evermore          800
  Prayer from the living source within the will,
  And beating up thro’ all the bitter world,
  Like fountains of sweet water in the sea,
  Kept him a living soul. ‘This miller’s wife’
  He said to Miriam ‘that you told me of,          805
  Has she no fear that her first husband lives?’
  ‘Ay, ay, poor soul’ said Miriam, ‘fear enow!
  If you could tell her you had seen him dead,
  Why, that would be her comfort;’ and he thought
  ‘After the Lord has call’d me she shall know,          810
  I wait his time’ and Enoch set himself,
  Scorning an alms, to work whereby to live.
  Almost to all things could he turn his hand.
  Cooper he was and carpenter, and wrought
  To make the boatmen fishing-nets, or help’d          815
  At lading and unlading the tall barks,
  That brought the stinted commerce of those days;
  Thus earn’d a scanty living for himself:
  Yet since he did but labour for himself,
  Work without hope, there was not life in it          820
  Whereby the man could live; and as the year
  Roll’d itself round again to meet the day
  When Enoch had return’d, a languor came
  Upon him, gentle sickness, gradually
  Weakening the man, till he could do no more,          825
  But kept the house, his chair, and last his bed.
  And Enoch bore his weakness cheerfully.
  For sure no gladlier does the stranded wreck
  See thro’ the gray skirts of a lifting squall
  The boat that bears the hope of life approach          830
  To save the life despair’d of, than he saw
  Death dawning on him, and the close of all.

    For thro’ that dawning gleam’d a kindlier hope
  On Enoch thinking ‘after I am gone,
  Then may she learn I loved her to the last.’          835
  He call’d aloud for Miriam Lane and said
  ‘Woman, I have a secret—only swear,
  Before I tell you—swear upon the book
  Not to reveal it, till you see me dead.’
  ‘Dead,’ clamour’d the good woman, ‘hear him talk!          840
  I warrant, man, that we shall bring you round.’
  ‘Swear’ added Enoch sternly ‘on the book.’
  And on the book, half-frighted, Miriam swore.
  Then Enoch rolling his gray eyes upon her,
  ‘Did you know Enoch Arden of this town?’          845
  ‘Know him?’ she said ‘I knew him far away.
  Ay, ay, I mind him coming down the street;
  Held his head high, and cared for no man, he.’
  Slowly and sadly Enoch answer’d her;
  ‘His head is low, and no man cares for him.          850
  I think I have not three days more to live;
  I am the man.’ At which the woman gave
  A half-incredulous, half-hysterical cry.
  ‘You Arden, you! nay,—sure he was a foot
  Higher than you be.’ Enoch said again          855
  ‘My God has bow’d me down to what I am;
  My grief and solitude have broken me;
  Nevertheless, know you that I am he
  Who married—but that name has twice been changed—
  I married her who married Philip Ray.          860
  Sit, listen.’ Then he told her of his voyage,
  His wreck, his lonely life, his coming back,
  His gazing in on Annie, his resolve,
  And how he kept it. As the woman heard,
  Fast flow’d the current of her easy tears,          865
  While in her heart she yearn’d incessantly
  To rush abroad all round the little haven,
  Proclaiming Enoch Arden and his woes;
  But awed and promise-bounden she forebore,
  Saying only ‘See your bairns before you go!          870
  Eh, let me fetch ’em, Arden,’ and arose
  Eager to bring them down, for Enoch hung
  A moment on her words, but then replied:
  ‘Woman, disturb me not now at the last,
  But let me hold my purpose till I die.          875
  Sit down again; mark me and understand,
  While I have power to speak. I charge you now,
  When you shall see her, tell her that I died
  Blessing her, praying for her, loving her;
  Save for the bar between us, loving her          880
  As when she laid her head beside my own.
  And tell my daughter Annie, whom I saw
  So like her mother, that my latest breath
  Was spent in blessing her and praying for her.
  And tell my son that I died blessing him.          885
  And say to Philip that I blest him too;
  He never meant us any thing but good.
  But if my children care to see me dead,
  Who hardly knew me living, let them come,
  I am their father; but she must not come,          890
  For my dead face would vex her after-life.
  And now there is but one of all my blood,
  Who will embrace me in the world-to-be:
  This hair is his: she cut it off and gave it,
  And I have borne it with me all these years,          895
  And thought to bear it with me to my grave;
  But now my mind is changed, for I shall see him,
  My babe in bliss: wherefore when I am gone,
  Take, give her this, for it may comfort her:
  It will moreover be a token to her,          900
  That I am he.’

                    He ceased; and Miriam Lane
  Made such a voluble answer promising all,
  That once again he roll’d his eyes upon her
  Repeating all he wish’d, and once again          905
  She promised.

                  Then the third night after this,
  While Enoch slumber’d motionless and pale,
  And Miriam watch’d and dozed at intervals,
  There came so loud a calling of the sea,          910
  That all the houses in the haven rang.
  He woke, he rose, he spread his arms abroad
  Crying with a loud voice ‘a sail! a sail!
  I am saved’; and so fell back and spoke no more.

    So past the strong heroic soul away.          915
  And when they buried him the little port
  Had seldom seen a costlier funeral.

                 *        *        *        *        *




                           =MORTE D’ARTHUR.=


  So all day long the noise of battle roll’d
  Among the mountains by the winter sea;
  Until King Arthur’s table, man by man,
  Had fallen in Lyonnesse about their Lord,
  King Arthur: then, because his wound was deep,          5
  The bold Sir Bedivere uplifted him,
  Sir Bedivere, the last of all his knights,
  And bore him to a chapel nigh the field,
  A broken chancel with a broken cross,
  That stood on a dark strait of barren land.          10
  On one side lay the Ocean, and on one
  Lay a great water, and the moon was full.
    Then spake King Arthur to Sir Bedivere:
  ‘The sequel of to-day unsolders all
  The goodliest fellowship of famous knights          15
  Whereof this world holds record. Such a sleep
  They sleep—the men I loved. I think that we
  Shall never more, at any future time,
  Delight our souls with talk of knightly deeds,
  Walking about the gardens and the halls          20
  Of Camelot, as in the days that were.
  I perish by this people which I made,—
  Tho’ Merlin sware that I should come again
  To rule once more—but let what will be, be,
  I am so deeply smitten thro’ the helm          25
  That without help I cannot last till morn.
  Thou therefore take my brand Excalibur,
  Which was my pride: for thou rememberest how
  In those old days, one summer noon, an arm
  Rose up from out the bosom of the lake,          30
  Clothed in white samite, mystic, wonderful,
  Holding the sword—and how I row’d across
  And took it, and have worn it, like a king:
  And, wheresoever I am sung or told
  In aftertime, this also shall be known:          35
  But now delay not: take Excalibur,
  And fling him far into the middle mere:
  Watch what thou seëst, and lightly bring me word.’
    To him replied the bold Sir Bedivere:
  ‘It is not meet, Sir King, to leave thee thus,          40
  Aidless, alone, and smitten thro’ the helm.
  A little thing may harm a wounded man.
  Yet I thy hest will all perform at full,
  Watch what I see, and lightly bring thee word.’
    So saying, from the ruin’d shrine he stept          45
  And in the moon athwart the place of tombs,
  Where lay the mighty bones of ancient men,
  Old knights, and over them the sea-wind sang
  Shrill, chill, with flakes of foam. He, stepping down
  By zig-zag paths, and juts of pointed rock,          50
  Came on the shining levels of the lake.
    There drew he forth the brand Excalibur,
  And o’er him, drawing it, the winter moon,
  Brightening the skirts of a long cloud, ran forth
  And sparkled keen with frost against the hilt;          55
  For all the haft twinkled with diamond sparks,
  Myriads of topaz-lights, and jacinth-work
  Of subtlest jewellery. He gazed so long
  That both his eyes were dazzled, as he stood,
  This way and that dividing the swift mind,          60
  In act to throw: but at the last it seem’d
  Better to leave Excalibur conceal’d
  There in the many-knotted waterflags,
  That whistled stiff and dry about the marge.
  So strode he back slow to the wounded King.          65
    Then spake King Arthur to Sir Bedivere:
  ‘Hast thou perform’d my mission which I gave?
  What is it thou hast seen? or what hast heard?’
    And answer made the bold Sir Bedivere:
  ‘I heard the ripple washing in the reeds,          70
  And the wild water lapping on the crag.’
    To whom replied King Arthur, faint and pale:
  ‘Thou hast betray’d thy nature and thy name,
  Not rendering true answer, as beseem’d
  Thy fëalty, nor like a noble knight:          75
  For surer sign had follow’d, either hand,
  Or voice, or else a motion of the mere.
  This is a shameful thing for men to lie.
  Yet now, I charge thee, quickly go again
  As thou art lief and dear, and do the thing          80
  I bad thee, watch, and lightly bring me word.’
    Then went Sir Bedivere the second time
  Across the ridge, and paced beside the mere,
  Counting the dewy pebbles, fix’d in thought;
  But when he saw the wonder of the hilt,          85
  How curiously and strangely chased, he smote
  His palms together, and he cried aloud,
    ‘And if indeed I cast the brand away,
  Surely a precious thing, one worthy note,
  Should thus be lost for ever from the earth,          90
  Which might have pleased the eyes of many men.
  What good should follow this, if this were done?
  What harm, undone? deep harm to disobey,
  Seeing obedience is the bond of rule.
  Were it well to obey then, if a king demand          95
  An act unprofitable, against himself?
  The King is sick, and knows not what he does.
  What record, or what relic of my lord
  Should be to aftertime, but empty breath
  And rumours of a doubt? but were this kept,          100
  Stored in some treasure-house of mighty kings,
  Some one might show it at a joust of arms,
  Saying, “King Arthur’s sword, Excalibur,
  Wrought by the lonely maiden of the Lake
  Nine years she wrought it, sitting in the deeps          105
  Upon the hidden bases of the hills.”
  So might some old man speak in the aftertime
  To all the people, winning reverence.
  But now much honour and much fame were lost.’
    So spake he, clouded with his own conceit,          110
  And hid Excalibur the second time,
  And so strode back slow to the wounded King.
    Then spoke King Arthur, breathing heavily:
  ‘What is it thou hast seen? or what hast heard?’
    And answer made the bold Sir Bedivere:          115
  ‘I heard the water lapping on the crag,
  And the long ripple washing in the reeds.’
    To whom replied King Arthur, much in wrath:
  ‘Ah, miserable and unkind, untrue,
  Unknightly, traitor-hearted! Woe is me!          120
  Authority forgets a dying king,
  Laid widow’d of the power in his eye
  That bow’d the will. I see thee what thou art,
  For thou, the latest-left of all my knights,
  In whom should meet the offices of all,          125
  Thou wouldst betray me for the precious hilt;
  Either from lust of gold, or like a girl
  Valuing the giddy pleasure of the eyes.
  Yet, for a man may fail in duty twice,
  And the third time may prosper, get thee hence:          130
  But, if thou spare to fling Excalibur,
  I will arise and slay thee with my hands.’
    Then quickly rose Sir Bedivere, and ran,
  And, leaping down the ridges lightly, plunged
  Among the bulrush-beds, and clutch’d the sword,          135
  And strongly wheel’d and threw it. The great brand
  Made lightnings in the splendour of the moon,
  And flashing round and round, and whirl’d in an arch,
  Shot like a streamer of the northern morn,
  Seen where the moving isles of winter shock          140
  By night, with noises of the northern sea.
  So flash’d and fell the brand Excalibur:
  But ere he dipt the surface, rose an arm
  Clothed in white samite, mystic, wonderful,
  And caught him by the hilt, and brandish’d him          145
  Three times, and drew him under in the mere.
  And lightly went the other to the King.
    Then spoke King Arthur, drawing thicker breath:
  ‘Now see I by thine eyes that this is done.
  Speak out: what is it thou hast heard, or seen?’          150
    And answer made the bold Sir Bedivere:
  ‘Sir King, I closed mine eyelids, lest the gems
  Should blind my purpose, for I never saw,
  Nor shall see, here or elsewhere, till I die,
  Not tho’ I live three lives of mortal men,          155
  So great a miracle as yonder hilt.
  Then with both hands I flung him, wheeling him;
  But when I look’d again, behold an arm,
  Clothed in white samite, mystic, wonderful,
  That caught him by the hilt, and brandish’d him          160
  Three times, and drew him under in the mere.’
    And answer made King Arthur, breathing hard:
  ‘My end draws nigh; ’tis time that I were gone.
  Make broad thy shoulders to receive my weight,
  And bear me to the margin; yet I fear          165
  My wound hath taken cold, and I shall die.’
    So saying, from the pavement he half rose,
  Slowly, with pain, reclining on his arm,
  And looking wistfully with wide blue eyes
  As in a picture. Him Sir Bedivere          170
  Remorsefully regarded thro’ his tears,
  And would have spoken, but he found not words,
  Then took with care, and kneeling on one knee,
  O’er both his shoulders drew the languid hands,
  And rising bore him thro’ the place of tombs.          175
    But, as he walk’d, King Arthur panted hard,
  Like one that feels a nightmare on his bed
  When all the house is mute. So sigh’d the King,
  Muttering and murmuring at his ear, ‘Quick, quick!
  I fear it is too late, and I shall die.’          180
  But the other swiftly strode from ridge to ridge,
  Clothed with his breath, and looking, as he walk’d,
  Larger than human on the frozen hills.
  He heard the deep behind him, and a cry
  Before. His own thought drove him, like a goad.          185
  Dry clash’d his harness in the icy caves
  And barren chasms, and all to left and right
  The bare black cliff clang’d round him, as he based
  His feet on juts of slippery crag that rang
  Sharp-smitten with the dint of armed heels—          190
  And on a sudden, lo! the level lake,
  And the long glories of the winter moon.
    Then saw they how there hove a dusky barge,
  Dark as a funeral scarf from stem to stern,
  Beneath them; and descending they were ware          195
  That all the decks were dense with stately forms
  Black-stoled, black-hooded, like a dream—by these
  Three Queens with crowns of gold—and from them rose
  A cry that shiver’d to the tingling stars,
  And, as it were one voice, an agony          200
  Of lamentation, like a wind that shrills
  All night in a waste land, where no one comes,
  Or hath come, since the making of the world.
    Then murmur’d Arthur, ‘Place me in the barge,’
  And to the barge they came. There those three Queens          205
  Put forth their hands, and took the King, and wept.
  But she, that rose the tallest of them all
  And fairest, laid his head upon her lap,
  And loosed the shatter’d casque, and chafed his hands,
  And call’d him by his name, complaining loud,          210
  And dropping bitter tears against his brow
  Striped with dark blood: for all his face was white
  And colourless, and like the wither’d moon
  Smote by the fresh beam of the springing east;
  And all his greaves and cuisses dash’d with drops          215
  Of onset; and the light and lustrous curls—
  That made his forehead like a rising sun
  High from the daïs-throne—were parch’d with dust,
  Or, clotted into points and hanging loose,
  Mix’d with the knightly growth that fringed his lips.          220
  So like a shatter’d column lay the King;
  Not like that Arthur who, with lance in rest,
  From spur to plume a star of tournament,
  Shot thro’ the lists at Camelot, and charged
  Before the eyes of ladies and of kings.          225
    Then loudly cried the bold Sir Bedivere,
  ‘Ah! my Lord Arthur, whither shall I go?
  Where shall I hide my forehead and my eyes?
  For now I see the true old times are dead,
  When every morning brought a noble chance,          230
  And every chance brought out a noble knight.
  Such times have been not since the light that led
  The holy Elders with the gift of myrrh.
  But now the whole ROUND TABLE is dissolved
  Which was an image of the mighty world;          235
  And I, the last, go forth companionless,
  And the days darken round me, and the years,
  Among new men, strange faces, other minds.’
    And slowly answered Arthur from the barge:
    The old order changeth, yielding place to new,          240
  And God fulfils Himself in many ways,
  Lest one good custom should corrupt the world.
  Comfort thyself: what comfort is in me?
  I have lived my life, and that which I have done
  May He within Himself make pure! but thou,          245
  If thou shouldst never see my face again,
  Pray for my soul. More things are wrought by prayer
  Than this world dreams of. Wherefore, let thy voice
  Rise like a fountain for me night and day.
  For what are men better than sheep or goats          250
  That nourish a blind life within the brain,
  If, knowing God, they lift not hands of prayer
  Both for themselves and those who call them friend?
  For so the whole round earth is every way
  Bound by gold chains about the feet of God.          255
  But now farewell. I am going a long way
  With these thou seëst—if indeed I go—
  (For all my mind is clouded with a doubt)
  To the island-valley of Avilion;
  Where falls not hail, or rain, or any snow,          260
  Nor ever wind blows loudly; but it lies
  Deep-meadow’d, happy, fair with orchard-lawns
  And bowery hollows crown’d with summer sea,
  Where I will heal me of my grievous wound.’
    So said he, and the barge with oar and sail          265
  Moved from the brink, like some full-breasted swan
  That, fluting a wild carol ere her death,
  Ruffles her pure cold plume, and takes the flood
  With swarthy webs. Long stood Sir Bedivere
  Revolving many memories, till the hull          270
  Look’d one black dot against the verge of dawn,
  And on the mere the wailing died away.

                 *        *        *        *        *




                       =THE PRISONER OF CHILLON.=


              I.

  My hair is gray, but not with years,
            Nor grew it white
            In a single night,
  As men’s have grown from sudden fears;
  My limbs are bow’d, though not with toil,          5
    But rusted with a vile repose,
  For they have been a dungeon’s spoil,
    And mine has been the fate of those
  To whom the goodly earth and air
  Are bann’d, and barr’d—forbidden fare;          10
  But this was for my father’s faith
  I suffer’d chains and courted death;
  That father perish’d at the stake
  For tenets he would not forsake;
  And for the same his lineal race          15
  In darkness found a dwelling-place;
  We were seven—who now are one,
    Six in youth, and one in age,
  Finish’d as they had begun,
    Proud of Persecution’s rage;          20
  One in fire, and two in field,
  Their belief with blood have seal’d;
  Dying as their father died,
  For the God their foes denied;
  Three were in a dungeon cast,          25
  Of whom this wreck is left the last.

              II.

  There are seven pillars of Gothic mould,
  In Chillon’s dungeons deep and old,
  There are seven columns, massy and gray,
  Dim with a dull imprison’d ray,          30
  A sunbeam which hath lost its way,
  And through the crevice and the cleft
  Of the thick wall is fallen and left;
  Creeping o’er the floor so damp,
  Like a marsh’s meteor lamp;          35
  And in each pillar there is a ring,
    And in each ring there is a chain;
  That iron is a cankering thing,
  For in these limbs its teeth remain,
  With marks that will not wear away,          40
  Till I have done with this new day,
  Which now is painful to these eyes,
  Which have not seen the sun so rise
  For years—I cannot count them o’er,
  I lost their long and heavy score          45
  When my last brother droop’d and died
  And I lay living by his side.

               III.

  They chain’d us each to a column stone
  And we were three—yet, each alone;
  We could not move a single pace,          50
  We could not see each other’s face,
  But with that pale and livid light
  That made us strangers in our sight;
  And thus together—yet apart
  Fetter’d in hand, but joined in heart;          55
  ’Twas still some solace in the dearth
  Of the pure elements of earth,
  To hearken to each other’s speech,
  And each turn comforter to each
  With some new hope, or legend old,          60
  Or song heroically bold;
  But even these at length grew cold.
  Our voices took a dreary tone,
  An echo of the dungeon-stone,
    A grating sound—not full and free          65
    As they of yore were wont to be;
    It might be fancy—but to me
  They never sounded like our own.

              IV.

  I was the eldest of the three,
    And to uphold and cheer the rest          70
    I ought to do—and did—my best,
  And each did well in his degree.
    The youngest, whom my father loved
  Because our mother’s brow was given
  To him—with eyes as blue as heaven—          75
    For him my soul was sorely moved;
  And truly might it be distrest
  To see such bird in such a nest;
  For he was beautiful as day—
    (When day was beautiful to me          80
    As to young eagles, being free)—
    A polar day, which will not see
  A sunset till its summer’s gone,
    Its sleepless summer of long light,
  The snow-clad offspring of the sun;          85
    And thus he was as pure and bright,
  And in his natural spirit gay,
  With tears for nought but others’ ills,
  And then they flowed like mountain rills,
  Unless he could assuage the woe          90
  Which he abhorr’d to view below.

              V.

  The other was as pure of mind,
  But form’d to combat with his kind;
  Strong in his frame, and of a mood
  Which ’gainst the world in war had stood,          95
  And perish’d in the foremost rank
    With joy:—but not in chains to pine:
  His spirit wither’d with their clank,
    I saw it silently decline—
    And so perchance in sooth did mine;          100
  But yet I forced it on to cheer
  Those relics of a home so dear.
  He was a hunter of the hills,
    Had follow’d there the deer and wolf;
    To him this dungeon was a gulf,          105
  And fetter’d feet the worst of ills.

              VI.

    Lake Leman lies by Chillon’s walls:
  A thousand feet in depth below
  Its massy waters meet and flow;
  Thus much the fathom-line was sent          110
  From Chillon’s snow-white battlement,
    Which round about the wave inthrals:
  A double dungeon wall and wave
  Have made and like a living grave.
  Below the surface of the lake          115
  The dark vault lies wherein we lay,
  We heard it ripple night and day;
    Sounding o’er our heads it knock’d;
  And I have felt the winter’s spray
  Wash through the bars when winds were high,          120
  And wanton in the happy sky;
    And then the very rock hath rock’d.
    And I have felt it shake, unshock’d,
  Because I could have smiled to see
  The death that would have set me free.          125

              VII.

  I said my nearer brother pined,
  I said his mighty heart declined,
  He loathed and put away his food:
  It was not that ’twas coarse and rude,
  For we were used to hunter’s fare,          130
  And for the like had little care:
  The milk drawn from the mountain goat
  Was changed for water from the moat,
  Our bread was such as captives’ tears
  Have moisten’d many a thousand years,          135
  Since man first pent his fellow-men
  Like brutes within an iron den:
  But what were these to us or him?
  These wasted not his heart or limb;
  My brother’s soul was of that mould          140
  Which in a palace had grown cold,
  Had his free breathing been denied
  The range of the steep mountain’s side;
  But why delay the truth?—he died.
  I saw, and could not hold his head,          145
  Nor reach his dying hand—nor dead—
  Though hard I strove, but strove in vain,
  To rend and gnash my bonds in twain.
  He died—and they unlock’d his chain,
  And scoop’d for him a shallow grave          150
  Even from the cold earth of our cave.
  I begg’d them, as a boon, to lay
  His corse in dust whereon the day
  Might shine—it was a foolish thought,
  But then within my brain it wrought,          155
  That even in death his free-born breast
  In such a dungeon could not rest.
  I might have spared my idle prayer—
  They coldly laugh’d—and laid him there:
  The flat and turfless earth above          160
  The being we so much did love;
  His empty chain above it leant,
  Such murder’s fitting monument!

              VIII.

  But he, the favourite and the flower,
  Most cherish’d since his natal hour,          165
  His mother’s image in fair face,
  The infant love of all his race,
  His martyr’d father’s dearest thought
  My latest care, for whom I sought
  To hoard my life, that his might be          170
  Less wretched now, and one day free;
  He, too, who yet had held untired
  A spirit natural or inspired—
  He, too, was struck, and day by day
  Was wither’d on the stalk away.          175
  O God! it is a fearful thing
  To see the human soul take wing
  In any shape, in any mood:—
  I’ve seen it rushing forth in blood,
  I’ve seen it on the breaking ocean          180
  Strive with a swoln convulsive motion,
  I’ve seen the sick and ghastly bed
  Of Sin delirious with its dread:
  But these were horrors—this was woe
  Unmixed with such—but sure and slow;          185
  He faded, and so calm and meek,
  So softly worn, so sweetly weak,
  So tearless, yet so tender—kind,
  And grieved for those he left behind;
  With all the while a cheek whose bloom          190
  Was as a mockery of the tomb,
  Whose tints as gently sunk away
  As a departing rainbow’s ray—
  An eye of most transparent light,
  That almost made the dungeon bright,          195
  And not a word of murmur—not
  A groan o’er his untimely lot—
  A little talk of better days,
  A little hope my own to raise,
  For I was sunk in silence—lost          200
  In this last loss, of all the most;
  And then the sighs he would suppress,
  Of fainting nature’s feebleness,
  More slowly drawn, grew less and less;
  I listen’d, but I could not hear—          205
  I call’d, for I was wild with fear;
  I knew ’twas hopeless, but my dread
  Would not be thus admonished;
  I call’d, and thought I heard a sound—
  I burst my chain with one strong bound,          210
  And rush’d to him:—I found him not,
  _I_ only stirr’d in this black spot,
  _I_ only lived—_I_ only drew
  The accursed breath of dungeon-dew;
  The last—the sole—the dearest link          215
  Between me and the eternal brink,
  Which bound me to my failing race,
  Was broken in this fatal place.
  One on the earth, and one beneath—
  My brothers—both had ceased to breathe.          220
  I took that hand which lay so still,
  Alas! my own was full as chill;
  I had not strength to stir, or strive,
  But felt that I was still alive—
  A frantic feeling, when we know          225
  That what we love shall ne’er be so.
          I know not why
          I could not die,
  I had no earthly hope—but faith,
  And that forbade a selfish death.          230

              IX.

  What next befell me then and there
    I know not well—I never knew—
  First came the loss of light, and air,
    And then of darkness too:
  I had no thought, no feeling—none—          235
  Among the stones I stood a stone,
  And was, scarce conscious what I wist,
  As shrubless crags within the mist;
  For all was blank, and bleak, and gray,
  It was not night—it was not day,          240
  It was not even the dungeon-light,
  So hateful to my heavy sight,
  But vacancy absorbing space,
  And fixedness—without a place;
  There were no stars—no earth—no time—          245
  No check—no change—no good—no crime
  But silence, and a stirless breath
  Which neither was of life nor death;
  A sea of stagnant idleness,
  Blind, boundless, mute, and motionless!          250

              X.

  A light broke in upon my brain—
    It was the carol of a bird;
  It ceased, and then it came again,
    The sweetest song ear ever heard,
  And mine was thankful till my eyes          255
  Ran over with the glad surprise,
  And they that moment could not see
  I was the mate of misery;
  But then by dull degrees came back
  My senses to their wonted track,          260
  I saw the dungeon walls and floor
  Close slowly round me as before,
  I saw the glimmer of the sun
  Creeping as it before had done,
  But through the crevice where it came          265
  That bird was perch’d, as fond and tame,
    And tamer than upon the tree;
  A lovely bird, with azure wings,
  And song that said a thousand things,
    And seem’d to say them all for me!          270
  I never saw its like before,
  I ne’er shall see its likeness more:
  It seem’d, like me, to want a mate,
  But was not half so desolate,
  And it was come to love me when          275
  None lived to love me so again,
  And cheering from my dungeon’s brink,
  Had brought me back to feel and think.
  I know not if it late were free,
    Or broke its cage to perch on mine,          280
  But knowing well captivity,
    Sweet bird! I could not wish for thine!
  Or if it were, in winged guise,
  A visitant from Paradise;
  For—Heaven forgive that thought! the while          285
  Which made me both to weep and smile—
  I sometimes deem’d that it might be
  My brother’s soul come down to me;
  But then at last away it flew,
  And then ’twas mortal—well I knew,          290
  For he would never thus have flown,
  And left me twice so doubly lone—
  Lone—as the corse within its shroud,
  Lone—as a solitary cloud,
    A single cloud on a sunny day,          295
  While all the rest of heaven is clear,
  A frown upon the atmosphere,
  That hath no business to appear
    When skies are blue, and earth is gay.

              XI.

  A kind of change came in my fate,          300
  My keepers grew compassionate,
  I know not what had made them so,
  They were inured to sights of woe,
  But so it was:—my broken chain
  With links unfasten’d did remain,          305
  And it was liberty to stride
  Along my cell from side to side,
  And up and down, and then athwart,
  And tread it over every part;
  And round the pillars one by one,          310
  Returning where my walk begun,
  Avoiding only, as I trod,
  My brothers’ graves without a sod;
  For if I thought with heedless tread
  My step profaned their lowly bed,          315
  My breath came gaspingly and thick,
  And my crush’d heart fell blind and sick.

              XII.

  I made a footing in the wall,
    It was not therefrom to escape,
  For I had buried one and all,          320
    Who loved me in a human shape;
  And the whole earth would henceforth be
  A wider prison unto me:
  No child—no sire—no kin had I,
  No partner in my misery;          325
  I thought of this, and I was glad,
  For thought of them had made me mad;
  But I was curious to ascend
  To my barr’d windows, and to bend
  Once more, upon the mountains high,          330
  The quiet of a loving eye.

              XIII.

  I saw them—and they were the same,
  They were not changed like me in frame;
  I saw their thousand years of snow
  On high—their wide long lake below,          335
  And the blue Rhone in fullest flow;
  I heard the torrents leap and gush
  O’er channell’d rock and broken bush;
  I saw the white-wall’d distant town,
  And whiter sails go skimming down;          340
  And then there was a little isle,
  Which in my very face did smile,
          The only one in view;
  A small green isle, it seem’d no more,
  Scarce broader than my dungeon floor;          345
  But in it there were three tall trees,
  And o’er it blew the mountain breeze,
  And by it there were waters flowing,
  And on it there were young flowers growing,
            Of gentle breath and hue.          350
  The fish swam by the castle wall,
  And they seem’d joyous each and all;
  The eagle rode the rising blast,
  Methought he never flew so fast
  As then to me he seem’d to fly,          355
  And then new tears came in my eye,
  And I felt troubled—and would fain
  I had not left my recent chain;
  And when I did descend again,
  The darkness of my dim abode          360
  Fell on me as a heavy load;
  It was as is a new-dug grave,
  Closing o’er one we sought to save,
  And yet my glance, too much opprest,
  Had almost need of such a rest.          365

              XIV.

  It might be months, or years, or days,
    I kept no count—I took no note,
  I had no hope my eyes to raise,
    And clear them of their dreary mote;
  At last men came to set me free,          370
    I ask’d not why, and reck’d not where.
  It was at length the same to me,
  Fetter’d or fetterless to be,
    I learn’d to love despair.
  And thus when they appear’d at last,          375
  And all my bonds aside were cast,
  These heavy walls to me had grown
  A hermitage—and all my own!
  And half I felt as they were come
  To tear me from a second home:          380
  With spiders I had friendship made,
  And watch’d them in their sullen trade,
  Had seen the mice by moonlight play,
  And why should I feel less than they?
  We were all inmates of one place,          385
  And I, the monarch of each race,
  Had power to kill—yet, strange to tell!
  In quiet we had learn’d to dwell—
  My very chains and I grew friends,
  So much a long communion tends          390
  To make us what we are:—Even I
  Regain’d my freedom with a sigh.

                 *        *        *        *        *




               =ELEGY, WRITTEN IN A COUNTRY CHURCHYARD.=


  The curfew tolls the knell of parting day,
    The lowing herd wind slowly o’er the lea,
  The plowman homeward plods his weary way,
    And leaves the world to darkness and to me.

  Now fades the glimmering landscape on the sight,          5
    And all the air a solemn stillness holds,
  Save where the beetle wheels his droning flight,
    And drowsy tinklings lull the distant folds;

  Save that from yonder ivy-mantled tow’r,
    The moping owl does to the moon complain          10
  Of such as, wand’ring near her secret bow’r,
    Molest her ancient solitary reign.

  Beneath those rugged elms, that yew-tree’s shade,
    Where heaves the turf in many a mould’ring heap,
  Each in his narrow cell forever laid,          15
    The rude forefathers of the hamlet sleep.

  The breezy call of incense-breathing Morn,
    The swallow twitt’ring from the straw-built shed,
  The cock’s shrill clarion, or the echoing horn,
    No more shall rouse them from their lowly bed.          20

  For them no more the blazing hearth shall burn,
    Or busy housewife ply her evening care;
  No children run to lisp their sire’s return,
    Or climb his knees the envied kiss to share.

  Oft did the harvest to their sickle yield,          25
    Their furrow oft the stubborn glebe has broke;
  How jocund did they drive their team afield!
    How bow’d the woods beneath their sturdy stroke!

  Let not Ambition mock their useful toil,
    Their homely joys, and destiny obscure;          30
  Nor Grandeur hear with a disdainful smile
    The short and simple annals of the poor.

  The boast of heraldry, the pomp of pow’r,
    And all that beauty, all that wealth e’er gave,
  Await alike th’inevitable hour,          35
    The paths of glory lead but to the grave.

  Nor you, ye proud, impute to these the fault,
    If Mem’ry o’er their tomb no trophies raise,
  Where thro’ the long-drawn aisle and fretted vault
    The pealing anthem swells the note of praise.          40

  Can storied urn, or animated bust,
    Back to its mansion call the fleeting breath?
  Can Honour’s voice provoke the silent dust,
    Or Flatt’ry sooth the dull cold ear of death?

  Perhaps in this neglected spot is laid          45
    Some heart once pregnant with celestial fire,
  Hands, that the rod of empire might have sway’d,
    Or wak’d to ecstasy the living lyre.

  But Knowledge to their eyes her ample page
    Rich with the spoils of time did ne’er unroll;          50
  Chill Penury repress’d their noble rage,
    And froze the genial current of the soul.

  Full many a gem of purest ray serene
    The dark unfathom’d caves of ocean bear;
  Full many a flower is born to blush unseen,          55
    And waste its sweetness on the desert air.

  Some village Hampden, that with dauntless breast
    The little Tyrant of his fields withstood,
  Some mute inglorious Milton here may rest,
    Some Cromwell guiltless of his country’s blood.          60

  Th’ applause of list’ning senates to command
    The threats of pain and ruin to despise,
  To scatter plenty o’er a smiling land,
    And read their hist’ry in a nation’s eyes.

  Their lot forbade: nor circumscrib’d alone          65
    Their growing virtues, but their crimes confin’d;
  Forbade to wade thro’ slaughter to a throne,
    And shut the gates of mercy on mankind;

  The struggling pangs of conscious truth to hide,
    To quench the blushes of ingenuous shame,          70
  Or heap the shrine of Luxury and Pride
    With incense kindled at the Muse’s flame.

  Far from the madding crowd’s ignoble strife,
    Their sober wishes never learn’d to stray;
  Along the cool sequester’d vale of life          75
    They kept the noiseless tenor of their way.

  Yet ev’n these bones from insult to protect
    Some frail memorial still erected nigh,
  With uncouth rhymes and shapeless sculpture deck’d
    Implores the passing tribute of a sigh.          80

  Their name, their years, spelt by th’ unletter’d Muse,
    The place of fame and elegy supply;
  And many a holy text around she strews,
    That teach the rustic moralist to die.

  For who, to dumb Forgetfulness a prey,          85
    This pleasing anxious being e’er resign’d,
  Left the warm precincts of the cheerful day,
    Nor cast one longing, ling’ring look behind?

  On some fond breast the parting soul relies,
    Some pious drops the closing eye requires;          90
  Ev’n from the tomb the voice of Nature cries,
    Ev’n in our ashes live their wonted fires.

  For thee, who, mindful of th’ unhonour’d dead,
    Dost in these lines their artless tale relate;
  If chance, by lonely Contemplation led,          95
    Some kindred spirit shall enquire thy fate,—

  Haply some hoary-headed swain may say,
    “Oft have we seen him at the peep of dawn
  Brushing with hasty steps the dews away,
    To meet the sun upon the upland lawn:          100

  “There at the foot of yonder nodding beech,
    That wreathes its old fantastic roots so high,
  His listless length at noontide would he stretch,
    And pore upon the brook that babbles by.

  “Hard by yon wood, now smiling as in scorn,          105
    Mutt’ring his wayward fancies he would rove;
  Now drooping woeful-wan, like one forlorn,
    Or craz’d with care, or cross’d in hopeless love.

  “One morn I miss’d him on the custom’d hill,
    Along the heath, and near his fav’rite tree;          110
  Another came; nor yet beside the rill,
    Nor up the lawn, nor at the wood was he;

  “The next, with dirges due in sad array,
    Slow through the church-way path we saw him borne:—
  Approach and read (for thou canst read) the lay          115
    Graved on the stone beneath yon aged thorn.”

                          THE EPITAPH.

  Here rests his head upon the lap of Earth,
    A youth, to Fortune and to Fame unknown:
  Fair Science frown’d not on his humble birth,
    And Melancholy mark’d him for her own.          120

  Large was his bounty, and his soul sincere,
    Heav’n did a recompense as largely send;
  He gave to Mis’ry all he had, a tear,
    He gain’d from Heav’n (’twas all he wish’d) a friend.

  No farther seek his merits to disclose,          125
    Or draw his frailties from their dread abode,
  (There they alike in trembling hope repose,)
    The bosom of his Father and his God.

                 *        *        *        *        *




                          =MY KATE.=


                 I.

  She was not as pretty as women I know,
  And yet all your best made of sunshine and snow
  Drop to shade, melt to nought in the long-trodden ways,
  While she’s still remembered on warm and cold days—
                                       My Kate.          5

                 II.

  Her air had a meaning, her movements a grace;
  You turned from the fairest to gaze on her face:
  And when you had once seen her forehead and mouth,
  You saw as distinctly her soul and her truth—
                                       My Kate.          10

                 III.

  Such a blue inner light from her eyelids outbroke,
  You looked at her silence and fancied she spoke:
  When she did, so peculiar yet soft was the tone,
  Though the loudest spoke also, you heard her alone—
                                       My Kate.          15

                 IV.

  I doubt if she said to you much that could act
  As a thought or suggestion; she did not attract
  In the sense of the brilliant or wise: I infer
  ’Twas her thinking of others made you think of her—
                                       My Kate.          20

                 V.

  She never found fault with you, never implied
  Your wrong by her right; and yet men at her side
  Grew nobler, girls purer, as through the whole town
  The children were gladder that pulled at her gown—
                                       My Kate.          25

                 VI.

  None knelt at her feet confessed lovers in thrall;
  They knelt more to God than they used,—that was all;
  If you praised her as charming, some asked what you meant,
  But the charm of her presence was felt when she went—
                                       My Kate.          30

                 VII.

  The weak and the gentle, the ribald and rude,
  She took as she found them, and did them all good;
  It always was so with her—see what you have!
  She has made the grass greener even here with her grave—
                                       My Kate.          35

                 VIII.

  My dear one!—when thou wast alive with the rest,
  I held thee the sweetest and loved thee the best;
  And now thou art dead, shall I not take thy part
  As thy smiles used to do for thyself, my sweet Heart
                                       My Kate.          40

                 *        *        *        *        *




                              =ROSABELLE.=


  Oh listen, listen, ladies gay!
    No haughty feat of arms I tell;
  Soft is the note and sad the lay
    That mourns the lovely Rosabelle.

  “Moor, moor the barge, ye gallant crew!          5
    And, gentle ladye, deign to stay!
  Rest thee in Castle Ravensheuch,
    Nor tempt the stormy firth to-day.

  “The blackening wave is edged with white;
    To inch and rock the sea-mews fly;          10
  The fishers have heard the Water-Sprite,
    Whose screams forbode that wreck is nigh.

  “Last night the gifted Seer did view
    A wet shroud swathed round ladye gay;
  Then stay thee, Fair, in Ravensheuch;          15
    Why cross the gloomy firth to-day?”—

  “’Tis not because Lord Lindesay’s heir
    To-night at Roslin leads the ball,
  But that my ladye-mother there
    Sits lonely in her castle-hall.          20

  “’Tis not because the ring they ride,
    And Lindesay at the ring rides well,
  But that my sire the wine will chide
    If ’tis not fill’d by Rosabelle.”—

  O’er Roslin all that dreary night          25
    A wondrous blaze was seen to gleam;
  ’Twas broader than the watch-fire’s light,
    And redder than the bright moonbeam.

  It glared on Roslin’s castled rock,
    It ruddied all the copse-wood glen;          30
  ’Twas seen from Dryden’s groves of oak,
    And seen from cavern’d Hawthornden.

  Seem’d all on fire that chapel proud,
    Where Roslin’s chiefs uncoffin’d lie,
  Each Baron, for a sable shroud,          35
    Sheathed in his iron panoply.

  Seem’d all on fire, within, around,
    Deep sacristy and altar’s pale;
  Shone every pillar foliage-bound,
    And glimmer’d all the dead men’s mail.          40

  Blazed battlement and pinnet high,
    Blazed every rose-carved buttress fair—
  So still they blaze, when fate is nigh
    The lordly line of high Saint Clair.

  There are twenty of Roslin’s barons bold          45
    Lie buried within that proud chapelle;
  Each one the holy vault doth hold—
    But the sea holds lovely Rosabelle!

  And each Saint Clair was buried there
    With candle, with book, and with knell;          50
  But the sea-caves rung, and the wild winds sung
    The dirge of lovely Rosabelle!

                 *        *        *        *        *




                              =LOCHINVAR.=


  O, young Lochinvar is come out of the west,
  Through all the wild border his steed was the best;
  And, save his good broadsword, he weapons had none,
  He rode all unarm’d, and he rode all alone.
  So faithful in love, and so dauntless in war,          5
  There never was knight like the young Lochinvar.

  He staid not for brake, and he stopp’d not for stone,
  He swam the Esk river where ford there was none;
  But ere he alighted at Netherby gate,
  The bride had consented, the gallant came late;          10
  For a laggard in love and a dastard in war,
  Was to wed the fair Ellen of brave Lochinvar.

  So boldly he enter’d the Netherby Hall,
  Among bride’s-men, and kinsmen, and brothers, and all:
  Then spoke the bride’s father, his hand on his sword,          15
  (For the poor craven bridegroom said never a word,)
  “O come ye in peace here, or come ye in war,
  Or to dance at our bridal, young Lord Lochinvar?”—

  “I long wooed your daughter, my suit you denied;—
  Love swells like the Solway, but ebbs like its tide—          20
  And now am I come, with this lost love of mine
  To lead but one measure, drink one cup of wine.
  There are maidens in Scotland more lovely by far
  That would gladly be bride to the young Lochinvar.”

  The bride kiss’d the goblet: the knight took it up,          25
  He quaffed off the wine, and he threw down the cup.
  She look’d down to blush, and she look’d up to sigh,
  With a smile on her lips, and a tear in her eye,
  He took her soft hand, ere her mother could bar,—
  “Now tread we a measure!” said young Lochinvar.          30

  So stately his form, and so lovely her face,
  There never a hall such a galliard did grace;
  While her mother did fret and her father did fume,
  And the bridegroom stood dangling his bonnet and plume;
  And the bride-maidens whispered, “’Twere better by far          35
  To have match’d our fair cousin with young Lochinvar.”

  One touch to her hand, and one word in her ear,
  When they reach’d the hall-door, and the charger stood near;
  So light to the croupe the fair lady he swung,
  So light to the saddle before her he sprung!          40
  “She is won! we are gone, over bank, bush, and scaur;
  They’ll have fleet steeds that follow,” quoth young Lochinvar.

  There was mounting ’mong Græmes of the Netherby clan;
  Forsters, Fenwicks, and Musgraves, they rode and they ran;
  There was racing and chasing on Cannobie Lee,          45
  But the lost bride of Netherby ne’er did they see.
  So daring in love, and so dauntless in war,
  Have ye e’er heard of gallant like young Lochinvar?

                 *        *        *        *        *




                            =TO A SKYLARK.=


                      Hail to thee, blithe spirit!
                        Bird thou never wert,
                      That from heaven or near it
                        Pourest thy full heart
  In profuse strains of unpremeditated art.          5

                      Higher still and higher
                        From the earth thou springest
                      Like a cloud of fire;
                        The deep blue thou wingest,
  And singing still dost soar, and soaring ever singest.          10

                      In the golden lightning
                        Of the sunken sun
                      O’er which clouds are brightening,
                        Thou dost float and run,
  Like an unbodied joy whose race has just begun.          15

                      The pale purple even
                        Melts around thy flight;
                      Like a star of heaven
                        In the broad daylight
  Thou art unseen, but yet I hear thy shrill delight;          20

                      Keen as are the arrows
                        Of that silver sphere,
                      Whose intense lamp narrows
                        In the white dawn clear
      Until we hardly see, we feel that it is there.          25

                      All the earth and air
                        With thy voice is loud,
                      As, when night is bare,
                        From one lonely cloud
  The moon rains out her beams, and heaven is overflow’d.          30

                      What thou art we know not;
                        What is most like thee?
                      From rainbow clouds there flow not
                        Drops so bright to see
  As from thy presence showers a rain of melody.          35

                      Like a poet hidden
                        In the light of thought,
                      Singing hymns unbidden,
                        Till the world is wrought
  To sympathy with hopes and fears it heeded not:          40

                      Like a high-born maiden
                        In a palace tower,
                      Soothing her love-laden
                        Soul in secret hour
  With music sweet as love which overflows her bower:          45

                      Like a glow-worm golden
                        In a dell of dew,
                      Scattering unbeholden
                        Its aerial hue
  Among the flowers and grass which screen it from the view:          50

                      Like a rose embowered
                        In its own green leaves,
                      By warm winds deflowered,
                        Till the scent it gives
  Makes faint with too much sweet these heavy-wingéd thieves.          55

                      Sound of vernal showers
                        On the twinkling grass,
                      Rain awaken’d flowers,
                        All that ever was
  Joyous and clear and fresh thy music doth surpass.          60

                      Teach us, sprite or bird,
                        What sweet thoughts are thine;
                      I have never heard
                        Praise of love or wine
  That panted forth a flood of rapture so divine:          65

                      Chorus hymeneal
                        Or triumphant chaunt
                      Match’d with thine, would be all
                        But an empty vaunt,
  A thing wherein we feel there is some hidden want.          70

                      What objects are the fountains
                        Of thy happy strain?
                      What fields or waves or mountains?
                        What shapes of sky or plain?
  What love of thine own kind? what ignorance of pain?          75

                      With thy clear keen joyance
                        Languor cannot be:
                      Shadow of annoyance
                        Never came near thee:
  Thou lovest; but ne’er knew love’s sad satiety.          80

                      Waking or asleep
                        Thou of death must deem
                      Things more true and deep
                        Than we mortals dream,
  Or how could thy notes flow in such a crystal stream?          85

                      We look before and after,
                        And pine for what is not.
                      Our sincerest laughter
                        With some pain is fraught;
  Our sweetest songs are those that tell of saddest thought.          90

                      Yet if we could scorn
                        Hate and pride and fear;
                      If we were things born
                        Not to shed a tear,
  I know not how thy joy we ever should come near.          95

                      Better than all measures
                        Of delightful sound,
                      Better than all treasures
                        That in books are found,
  Thy skill to poets were, thou scorner of the ground!          100

                      Teach me half the gladness
                        That thy brain must know,
                      Such harmonious madness
                        From my lips would flow,
  The world should listen then, as I am listening now!          105

                      Like a poet hidden
                        In the light of thought,
                      Singing hymns unbidden,
                        Till the world is wrought
  To sympathy with hopes and fears it heeded not:          40

                      Like a high-born maiden
                        In a palace tower,
                      Soothing her love-laden
                        Soul in secret hour
  With music sweet as love which overflows her bower:          45

                      Like a glow-worm golden
                        In a dell of dew,
                      Scattering unbeholden
                        Its aerial hue
  Among the flowers and grass which screen it from the view:          50

                      Like a rose embowered
                        In its own green leaves,
                      By warm winds deflowered,
                        Till the scent it gives
  Makes faint with too much sweet these heavy-wingéd thieves.          55

                      Sound of vernal showers
                        On the twinkling grass,
                      Rain awaken’d flowers,
                        All that ever was
  Joyous and clear and fresh thy music doth surpass.          60

                      Teach us, sprite or bird,
                        What sweet thoughts are thine;
                      I have never heard
                        Praise of love or wine
  That panted forth a flood of rapture so divine:          65

                      Chorus hymeneal
                        Or triumphant chaunt
                      Match’d with thine, would be all
                        But an empty vaunt,
  A thing wherein we feel there is some hidden want.          70

                      What objects are the fountains
                        Of thy happy strain?
                      What fields or waves or mountains?
                        What shapes of sky or plain?
  What love of thine own kind? what ignorance of pain?          75

                      With thy clear keen joyance
                        Languor cannot be:
                      Shadow of annoyance
                        Never came near thee:
  Thou lovest; but ne’er knew love’s sad satiety.          80

                      Waking or asleep
                        Thou of death must deem
                      Things more true and deep
                        Than we mortals dream,
  Or how could thy notes flow in such a crystal stream?          85

                      We look before and after,
                        And pine for what is not.
                      Our sincerest laughter
                        With some pain is fraught;
  Our sweetest songs are those that tell of saddest thought.          90

                      Yet if we could scorn
                        Hate and pride and fear;
                      If we were things born
                        Not to shed a tear,
  I know not how thy joy we ever should come near.          95

                      Better than all measures
                        Of delightful sound,
                      Better than all treasures
                        That in books are found,
  Thy skill to poets were, thou scorner of the ground!          100

                      Teach me half the gladness
                        That thy brain must know,
                      Such harmonious madness
                        From my lips would flow,
  The world should listen then, as I am listening now!          105

                 *        *        *        *        *




                                =ENID.=


  The brave Geraint, a knight of Arthur’s court,
  A tributary prince of Devon, one
  Of that great Order of the Table Round,
  Had wedded Enid, Yniol’s only child,
  And loved her, as he loved the light of Heaven.          5
  And as the light of Heaven varies, now
  At sunrise, now at sunset, now by night
  With moon and trembling stars, so loved Geraint
  To make her beauty vary day by day,
  In crimsons and in purples and in gems.          10
  And Enid, but to please her husband’s eye,
  Who first had found and loved her in a state
  Of broken fortunes, daily fronted him
  In some fresh splendour; and the Queen herself,
  Grateful to Prince Geraint for service done,          15
  Lov’d her, and often with her own white hands
  Array’d and deck’d her, as the loveliest,
  Next after her own self, in all the court.
  And Enid loved the Queen, and with true heart
  Adored her, as the stateliest and the best          20
  And loveliest of all women upon earth.
  And seeing them so tender and so close
  Long in their common love rejoiced Geraint.
  But when a rumour rose about the Queen,
  Touching her guilty love for Lancelot,          25
  Though yet there lived no proof, nor yet was heard
  The world’s loud whisper breaking into storm,
  Not less Geraint believed it; and there fell
  A horror on him, lest his gentle wife,
  Through that great tenderness for Guinevere,          30
  Had suffer’d, or should suffer any taint
  In nature: wherefore going to the King,
  He made this pretext, that his princedom lay
  Close on the borders of a territory,
  Wherein were bandit earls, and caitiff knights,          35
  Assassins, and all fliers from the hand
  Of Justice, and whatever loathes a law:
  And therefore, till the King himself should please
  To cleanse this common sewer of all his realm,
  He craved a fair permission to depart,          40
  And there defend his marches; and the King
  Mused for a little on his plea, but, last,
  Allowing it, the Prince and Enid rode,
  And fifty knights rode with them, to the shores
  Of Severn, and they pass’d to their own land;          45
  Where, thinking, that if ever yet was wife
  True to her lord, mine shall be so to me,
  He compass’d her with sweet observances
  And worship, never leaving her, and grew
  Forgetful of his promise to the King,          50
  Forgetful of the falcon and the hunt,
  Forgetful of the tilt and tournament,
  Forgetful of his glory and his name,
  Forgetful of his princedom and its cares.
  And this forgetfulness was hateful to her.          55
  And by and by the people, when they met
  In twos and threes, or fuller companies,
  Began to scoff and jeer and babble of him
  As of a prince whose manhood was all gone,
  And molten down in mere uxoriousness.          60
  And this she gather’d from the people’s eyes;
  This too the women who attired her head,
  To please her, dwelling on his boundless love,
  Told Enid, and they sadden’d her the more:
  And day by day she thought to tell Geraint,          65
  But could not out of bashful delicacy;
  While he that watch’d her sadden, was the more
  Suspicious that her nature had a taint.

    At last it chanced that on a summer morn
  (They sleeping each by other) the new sun          70
  Beat through the blindless casement of the room,
  And heated the strong warrior in his dreams;
  Who, moving, cast the coverlet aside,
  And bared the knotted column of his throat,
  The massive square of his heroic breast,          75
  And arms on which the standing muscle sloped,
  As slopes a wild brook o’er a little stone,
  Running too vehemently to break upon it.
  And Enid woke and sat beside the couch,
  Admiring him, and thought within herself,          80
  Was ever man so grandly made as he?
  Then, like a shadow, pass’d the people’s talk
  And accusation of uxoriousness
  Across her mind, and bowing over him,
  Low to her own heart piteously she said:          85

    “O noble breast and all-puissant arms,
  Am I the cause, I the poor cause that men
  Reproach you, saying all your force is gone?
  I _am_ the cause, because I dare not speak
  And tell him what I think and what they say.          90
  And yet I hate that he should linger here;
  I cannot love my lord and not his name.
  Far liefer had I gird his harness on him,
  And ride with him to battle and stand by,
  And watch his mightful hand striking great blows          95
  At caitiffs and at wrongers of the world.
  Far better were I laid in the dark earth,
  Not hearing any more his noble voice,
  Not to be folded more in these dear arms,
  And darken’d from the high light in his eyes,          100
  Than that my lord through me should suffer shame.
  Am I so bold, and could I so stand by,
  And see my dear lord wounded in the strife,
  Or maybe pierc’d to death before mine eyes,
  And yet not dare to tell him what I think,          105
  And how men slur him, saying all his force
  Is melted into mere effeminacy?
  O me, I feel that I am no true wife.”

    Half inwardly, half audibly she spoke,
  And the strong passion in her made her weep          110
  True tears upon his broad and naked breast,
  And these awoke him, and by great mischance
  He heard but fragments of her later words,
  And that she fear’d she was not a true wife.
  And then he thought, “In spite of all my care,          115
  For all my pains, poor man, for all my pains,
  She is not faithful to me, and I see her
  Weeping for some gay knight in Arthur’s hall.”
  Then, though he lov’d and reverenc’d her too much
  To dream she could be guilty of foul act,          120
  Right through his manful breast darted the pang
  That makes a man, in the sweet face of her
  Whom he loves most, lonely and miserable.
  At this he hurl’d his huge limbs out of bed,
  And shook his drowsy squire awake and cried,          125
  “My charger and her palfrey;” then to her,
  “I will ride forth into the wilderness;
  For though it seems my spurs are yet to win,
  I have not fall’n so low as some would wish.
  And you put on your worst and meanest dress          130
  And ride with me.” And Enid ask’d, amaz’d,
  “If Enid errs, let Enid learn her fault.”
  But he, “I charge you, ask not, but obey.”
  Then she bethought her of a faded silk,
  A faded mantle and a faded veil,          135
  And moving toward a cedarn cabinet,
  Wherein she kept them folded reverently
  With sprigs of summer laid between the folds,
  She took them, and array’d herself therein,
  Remembering when first he came on her          140
  Drest in that dress, and how he lov’d her in it,
  And all her foolish fears about the dress,
  And all his journey to her, as himself
  Had told her, and their coming to the court.

    For Arthur on the Whitsuntide before          145
  Held court at old Caerleon upon Usk.
  There on a day, he sitting high in hall,
  Before him came a forester of Dean,
  Wet from the woods, with notice of a hart
  Taller than all his fellows, milky white,          150
  First seen that day: these things he told the King.
  Then the good King gave order to let blow
  His horns for hunting on the morrow morn.
  And when the Queen petition’d for his leave
  To see the hunt, allow’d it easily.          155
  So with the morning all the court were gone.
  But Guinevere lay late into the morn,
  Lost in sweet dreams, and dreaming of her love
  For Lancelot, and forgetful of the hunt;
  But rose at last, a single maiden with her,          160
  Took horse, and forded Usk, and gain’d the wood;
  There, on a little knoll beside it, stay’d
  Waiting to hear the hounds; but heard instead
  A sudden sound of hoofs, for Prince Geraint,
  Late also, wearing neither hunting-dress          165
  Nor weapon, save a golden-hilted brand,
  Came quickly flashing through the shallow ford
  Behind them, and so gallop’d up the knoll.
  A purple scarf, at either end whereof
  There swung an apple of the purest gold,          170
  Sway’d round about him, as he gallop’d up
  To join them, glancing like a dragon-fly
  In summer suit and silks of holiday.
  Low bow’d the tributary Prince, and she,
  Sweetly and statelily, and with all grace          175
  Of womanhood and queenhood, answer’d him:
  “Late, late, Sir Prince,” she said, “later than we!”
  “Yea, noble Queen,” he answer’d, “and so late
  That I but come like you to see the hunt,
  Not join it.” “Therefore wait with me,” she said;          180
  “For on this little knoll, if anywhere,
  There is good chance that we shall hear the hounds:
  Here often they break covert at our feet.”

    And while they listen’d for the distant hunt,
  And chiefly for the baying of Cavall,          185
  King Arthur’s hound of deepest mouth, there rode
  Full slowly by a knight, lady, and dwarf;
  Whereof the dwarf lagg’d latest, and the knight
  Had vizor up, and show’d a youthful face,
  Imperious, and of haughtiest lineaments.          190
  And Guinevere, not mindful of his face
  In the King’s hall, desired his name, and sent
  Her maiden to demand it of the dwarf;
  Who being vicious, old and irritable,
  And doubling all his master’s vice of pride,          195
  Made answer sharply that she should not know.
  “Then will I ask it of himself,” she said.
  “Nay, by my faith, thou shalt not,” cried the dwarf;
  “Thou art not worthy ev’n to speak of him;”
  And when she put her horse toward the knight,          200
  Struck at her with his whip, and she return’d
  Indignant to the Queen; at which Geraint
  Exclaiming, “Surely I will learn the name,”
  Made sharply to the dwarf, and ask’d it of him,
  Who answer’d as before; and when the Prince          205
  Had put his horse in motion toward the knight,
  Struck at him with his whip, and cut his cheek.
  The Prince’s blood spirted upon the scarf,
  Dyeing it; and his quick, instinctive hand
  Caught at the hilt, as to abolish him:          210
  But he from his exceeding manfulness
  And pure nobility of temperament,
  Wroth to be wroth at such a worm, refrain’d
  From ev’n a word, and so returning said:

    “I will avenge this insult, noble Queen,          215
  Done in your maiden’s person to yourself:
  And I will track this vermin to their earths;
  For though I ride unarmed, I do not doubt
  To find, at some place I shall come at, arms
  On loan, or else for pledge; and, being found,          220
  Then will I fight him, and will break his pride,
  And on the third day will again be here,
  So that I be not fall’n in fight. Farewell.”

    “Farewell, fair Prince,” answered the stately Queen,
  “Be prosperous in this journey, as in all;          225
  And may you light on all things that you love,
  And live to wed with her whom first you love.
  But ere you wed with any, bring your bride,
  And I, were she the daughter of a king,
  Yea, though she were a beggar from the hedge,          230
  Will clothe her for her bridals like the sun.”

    And Prince Geraint, now thinking that he heard
  The noble hart at bay, now the far horn,
  A little vex’d at losing of the hunt,
  A little at the vile occasion, rode,          235
  By ups and downs, through many a grassy glade
  And valley, with fix’d eye following the three.
  At last they issued from the world of wood,
  And climb’d upon a fair and even ridge,
  And show’d themselves against the sky, and sank.          240
  And thither came Geraint, and underneath
  Beheld the long street of a little town
  In a long valley, on one side of which,
  White from the mason’s hand, a fortress rose;
  And on one side a castle in decay,          245
  Beyond a bridge that spann’d a dry ravine:
  And out of town and valley came a noise
  As of a broad brook o’er a shingly bed
  Brawling, or like a clamour of the rooks
  At distance, ere they settle for the night.          250

    And onward to the fortress rode the three
  And enter’d, and were lost behind the walls.
  “So,” thought Geraint, “I have track’d him to his earth.”
  And down the long street riding wearily,
  Found every hostel full, and everywhere          255
  Was hammer laid to hoof, and the hot hiss
  And bustling whistle of the youth who scour’d
  His master’s armour; and of such a one
  He ask’d, “What means the tumult in the town?”
  Who told him, scouring still, “The sparrow-hawk!”          260
  Then riding close behind an ancient churl,
  Who, smitten by the dusty sloping beam,
  Went sweating underneath a sack of corn,
  Ask’d yet once more what meant the hubbub here?
  Who answer’d gruffly, “Ugh! the sparrow-hawk,”          265
  Then riding farther past an armourer’s,
  Who, with back turn’d, and bow’d above his work,
  Sat riveting a helmet on his knee,
  He put the self-same query; but the man
  Not turning round, nor looking at him, said:          270
  “Friend, he that labours for the sparrow-hawk
  Has little time for idle questioners.”
  Whereat Geraint flash’d into sudden spleen:
  “A thousand pips eat up your sparrow-hawk!
  Tits, wrens, and all wing’d nothings peck him dead!          275
  Ye think the rustic cackle of your bourg
  The murmur of the world! What is it to me?
  O wretched set of sparrows, one and all,
  Who pipe of nothing but of sparrow-hawks!
  Speak, if you be not like the rest, hawk-mad,          280
  Where can I get me harbourage for the night?
  And arms, arms, arms to fight my enemy? Speak!”
  At this the armourer, turning all amazed
  And seeing one so gay in purple silks,
  Came forward with the helmet yet in hand,          285
  And answer’d, “Pardon me, O stranger knight;
  We hold a tourney here to-morrow morn,
  And there is scantly time for half the work.
  Arms? truth! I know not: all are wanted here.
  Harbourage? truth, good truth, I know not, save,          290
  It may be, at Earl Yniol’s, o’er the bridge
  Yonder.” He spoke and fell to work again.

    Then rode Geraint, a little spleenful yet,
  Across the bridge that spann’d the dry ravine.
  There musing sat the hoary-headed Earl          295
  (His dress a suit of fray’d magnificence,
  Once fit for feasts of ceremony), and said:
  “Whither, fair son?” to whom Geraint replied,
  “O friend, I seek a harbourage for the night.”
  Then Yniol, “Enter, therefore, and partake          300
  The slender entertainment of a house
  Once rich, now poor, but ever open-door’d.”
  “Thanks, venerable friend,” replied Geraint;
  “So that you do not serve me sparrow-hawks
  For supper, I will enter, I will eat          305
  With all the passion of a twelve hours’ fast.”
  Then sigh’d and smil’d the hoary-headed Earl,
  And answer’d, “Graver cause than yours is mine
  To curse this hedgerow thief, the sparrow-hawk.
  But in, go in; for save yourself desire it,          310
  We will not touch upon him ev’n in jest.”

    Then rode Geraint into the castle court,
  His charger trampling many a prickly star
  Of sprouted thistle on the broken stones.
  He look’d, and saw that all was ruinous.          315
  Here stood a shatter’d archway plumed with fern;
  And here had fall’n a great part of a tower,
  Whole, like a crag that tumbles from the cliff,
  And like a crag was gay with wilding flowers:
  And high above a piece of turret stair,          320
  Worn by the feet that now were silent, wound
  Bare to the sun, and monstrous ivy-stems
  Claspt the gray walls with hairy-fibred arms,
  And suck’d the joining of the stones, and look’d
  A knot, beneath, of snakes, aloft, a grove.          325

    And while he waited in the castle court,
  The voice of Enid, Yniol’s daughter, rang
  Clear through the open casement of the hall,
  Singing; and as the sweet voice of a bird,
  Heard by the lander in a lonely isle,          330
  Moves him to think what kind of bird it is
  That sings so delicately clear, and make
  Conjecture of the plumage and the form,—
  So the sweet voice of Enid moved Geraint;
  And made him like a man abroad at morn          335
  When first the liquid note beloved of men
  Comes flying over many a windy wave
  To Britain, and in April suddenly
  Breaks from a coppice gemm’d with green and red,
  And he suspends his converse with a friend,          340
  Or it may be the labour of his hands,
  To think or say, “There is the nightingale,”—
  So fared it with Geraint, who thought and said,
  “Here, by God’s grace, is the one voice for me.”

    It chanced the song that Enid sang was one          345
  Of Fortune and her wheel, and Enid sang:

    “Turn, Fortune, turn thy wheel and lower the proud;
  Turn thy wild wheel through sunshine, storm, and cloud;
  Thy wheel and thee we neither love nor hate.

    “Turn, Fortune, turn thy wheel with smile or frown;          350
  With that wild wheel we go not up or down;
  Our hoard is little, but our hearts are great.

    “Smile and we smile, the lords of many lands;
  Frown and we smile, the lords of our own hands;
  For man is man and master of his fate.          355

    “Turn, turn thy wheel above the staring crowd;
  Thy wheel and thou are shadows in the cloud;
  Thy wheel and thee we neither love nor hate.”

    “Hark, by the bird’s song you may learn the nest,”
  Said Yniol; “enter quickly.” Entering then,          360
  Right o’er a mount of newly-fallen stones,
  The dusky-rafter’d many-cobwebb’d hall,
  He found an ancient dame in dim brocade;
  And near her, like a blossom vermeil-white,
  That lightly breaks a faded flower-sheath,          365
  Moved the fair Enid, all in faded silk,
  Her daughter. In a moment thought Geraint,
  “Here by God’s rood is the one maid for me.”
  But none spake word except the hoary Earl:
  “Enid, the good knight’s horse stands in the court;          370
  Take him to stall, and give him corn, and then
  Go to the town and buy us flesh and wine;
  And we will make us merry as we may.
  Our hoard is little, but our hearts are great.”

    He spake: the Prince, as Enid pass’d him, fain          375
  To follow, strode a stride; but Yniol caught
  His purple scarf, and held, and said, “Forbear!
  Rest! the good house, though ruin’d, O my son,
  Endures not that her guest should serve himself.”
  And reverencing the custom of the house,          380
  Geraint, from utter courtesy, forbore.

    So Enid took his charger to the stall;
  And after went her way across the bridge,
  And reach’d the town, and while the Prince and Earl
  Yet spoke together, came again with one,          385
  A youth, that following with a costrel bore
  The means of goodly welcome, flesh and wine.
  And Enid brought sweet cakes to make them cheer,
  And in her veil enfolded, manchet bread.
  And then, because their hall must also serve          390
  For kitchen, boil’d the flesh and spread the board,
  And stood behind, and waited on the three.
  And seeing her so sweet and serviceable,
  Geraint had a longing in him evermore
  To stoop and kiss the tender little thumb,          395
  That crost the trencher as she laid it down:
  But after all had eaten, then Geraint,
  For now the wine made summer in his veins,
  Let his eye rove in following, or rest
  On Enid at her lowly handmaid-work,          400
  Now here, now there, about the dusky hall;
  Then suddenly addrest the hoary Earl:

    “Fair Host and Earl, I pray your courtesy;
  This sparrow-hawk, what is he? tell me of him.
  His name? but no, good faith, I will not have it;          405
  For if he be the knight whom late I saw
  Ride into that new fortress by your town,
  White from the mason’s hand, then have I sworn
  From his own lips to have it—I am Geraint
  Of Devon—for this morning when the Queen          410
  Sent her own maiden to demand the name,
  His dwarf, a vicious under-shapen thing,
  Struck at her with his whip, and she return’d
  Indignant to the Queen; and then I swore
  That I would track this caitiff to his hold,          415
  And fight and break his pride, and have it of him.
  And all unarm’d I rode, and thought to find
  Arms in your town, where all the men are mad;
  They take the rustic murmur of their bourg
  For the great wave that echoes round the world;          420
  They would not hear me speak; but if you know
  Where I can light on arms, or if yourself
  Should have them, tell me, seeing I have sworn
  That I will break his pride and learn his name,
  Avenging this great insult done the Queen.”          425

    Then cried Earl Yniol, “Art thou he indeed,
  Geraint, a name far sounded among men
  For noble deeds? and truly I, when first
  I saw you moving by me on the bridge,
  Felt you were somewhat, yea, and by your state          430
  And presence might have guess’d you one of those
  That eat in Arthur’s hall at Camelot.
  Nor speak I now from foolish flattery;
  For this dear child hath often heard me praise
  Your feats of arms, and often when I paused          435
  Had ask’d again, and ever loved to hear;
  So grateful is the noise of noble deeds
  To noble hearts who see but acts of wrong:
  Oh, never yet had woman such a pair
  Of suitors as this maiden; first Limours,          440
  A creature wholly given to brawls and wine,
  Drunk even when he woo’d; and be he dead
  I know not, but he pass’d to the wild land.
  The second was your foe, the sparrow-hawk,
  My curse, my nephew—I will not let his name          445
  Slip from my lips if I can help it—he,
  When I that knew him fierce and turbulent
  Refused her to him, then his pride awoke
  And since the proud man often is the mean,
  He sow’d a slander in the common ear          450
  Affirming that his father left him gold,
  And in my charge, which was not render’d to him;
  Bribed with large promises the men who serv’d
  About my person, the more easily
  Because my means were somewhat broken into          455
  Through open doors and hospitality;
  Rais’d my own town against me in the night
  Before my Enid’s birthday, sack’d my house;
  From mine own earldom foully ousted me;
  Built that new fort to overawe my friends,          460
  For truly there are those who love me yet;
  And keeps me in this ruinous castle here,
  Where doubtless he would put me soon to death,
  But that his pride too much despises me:
  And I myself sometimes despise myself;          465
  For I have let men be, and have their way;
  Am much too gentle, have not used my power:
  Nor know I whether I be very base
  Or very manful, whether very wise
  Or very foolish; only this I know,          470
  That whatsoever evil happen to me,
  I seem to suffer nothing heart or limb,
  But can endure it all most patiently.”

    “Well said, true heart,” replied Geraint, “but arms,
  That if, as I suppose, your nephew fights          475
  In next day’s tourney I may break his pride.”

    And Yniol answer’d, “Arms, indeed, but old
  And rusty, old and rusty, Prince Geraint,
  Are mine, and therefore at your asking, yours.
  But in this tournament can no man tilt,          480
  Except the lady he loves best be there.
  Two forks are fix’d into the meadow ground,
  And over these is laid a silver wand,
  And over that is placed a sparrow-hawk,
  The prize of beauty for the fairest there.          485
  And this, what knight soever be in field
  Lays claim to for the lady at his side,
  And tilts with my good nephew thereupon,
  Who being apt at arms and big of bone
  Has ever won it for the lady with him,          490
  And toppling over all antagonism
  Has earn’d himself the name of sparrow-hawk.
  But you, that have no lady, cannot fight.”

    To whom Geraint with eyes all bright replied,
  Leaning a little toward him, “Your leave!          495
  Let _me_ lay lance in rest, O noble host,
  For this dear child, because I never saw,
  Though having seen all beauties of our time,
  Nor can see elsewhere, anything so fair.
  And if I fall her name will yet remain          500
  Untarnish’d as before; but if I live,
  So aid me Heaven when at mine uttermost,
  As I will make her truly my true wife.”

    Then, howsoever patient, Yniol’s heart
  Danced in his bosom, seeing better days.          505
  And looking round he saw not Enid there
  (Who hearing her own name had slipt away),
  But that old dame, to whom full tenderly
  And fondling all her hand in his he said,
  “Mother, a maiden is a tender thing,          510
  And best by her that bore her understood.
  Go thou to rest, but ere thou go to rest
  Tell her, and prove her heart toward the Prince.”

    So spake the kindly-hearted Earl, and she
  With frequent smile and nod departing found,          515
  Half-disarray’d as to her rest, the girl;
  Whom first she kiss’d on either cheek, and then
  On either shining shoulder laid a hand,
  And kept her off and gazed upon her face,
  And told her all their converse in the hall,          520
  Proving her heart: but never light and shade
  Coursed one another more on open ground
  Beneath a troubled heaven, than red and pale
  Across the face of Enid hearing her;
  While slowly falling as a scale that falls,          525
  When weight is added only grain by grain,
  Sank her sweet head upon her gentle breast;
  Nor did she lift an eye nor speak a word,
  Rapt in the fear and in the wonder of it.
  So moving without answer to her rest          530
  She found no rest, and ever fail’d to draw
  The quiet night into her blood, but lay
  Contemplating her own unworthiness;
  And when the pale and bloodless east began
  To quicken to the sun, arose, and raised          535
  Her mother too, and hand in hand they moved
  Down to the meadow where the jousts were held,
  And waited there for Yniol and Geraint.

    And thither came the twain, and when Geraint
  Beheld her first in field awaiting him,          540
  He felt, were she the prize of bodily force,
  Himself beyond the rest pushing could move
  The chair of Idris. Yniol’s rusted arms
  Were on his princely person, but through these
  Princelike his bearing shone; and errant knights          545
  And ladies came, and by and by the town
  Flow’d in, and settling circled all the lists.
  And there they fix’d the forks into the ground,
  And over these they placed a silver wand,
  And over that a golden sparrow-hawk.          550
  Then Yniol’s nephew, after trumpet blown,
  Spake to the lady with him and proclaim’d,
  “Advance and take as fairest of the fair,
  For I these two years past have won it for thee,
  The prize of beauty.” Loudly spake the Prince,          555
  “Forbear; there is a worthier,” and the knight,
  With some surprise and thrice as much disdain,
  Turn’d, and beheld the four, and all his face
  Glow’d like the heart of a great fire at Yule,
  So burnt he was with passion, crying out,          560
  “Do battle for it then,” no more; and thrice
  They clash’d together, and thrice they brake their spears.
  Then each, dishorsed and drawing, lash’d at each
  So often and with such blows, that all the crowd
  Wonder’d, and now and then from distant walls          565
  There came a clapping as of phantom hands.
  So twice they fought, and twice they breathed, and still
  The dew of their great labour, and the blood
  Of their strong bodies, flowing, drain’d their force.
  But either’s force was match’d till Yniol’s cry,          570
  “Remember that great insult done the Queen,”
  Increased Geraint’s, who heaved his blade aloft,
  And crack’d the helmet through, and bit the bone,
  And fell’d him, and set foot upon his breast,
  And said, “Thy name?” To whom the fallen man          575
  Made answer, groaning, “Edyrn, son of Nudd!
  Ashamed am I that I should tell it thee.
  My pride is broken: men have seen my fall.”
  “Then, Edyrn, son of Nudd,” replied Geraint,
  “These two things shalt thou do, or else thou diest.          580
  First, thou thyself, thy lady, and thy dwarf,
  Shalt ride to Arthur’s court, and being there,
  Crave pardon for that insult done the Queen,
  And shalt abide her judgment on it; next,
  Thou shalt give back their earldom to thy kin.          585
  These two things shalt thou do, or thou shalt die.”
  And Edyrn answer’d, “These things will I do,
  For I have never yet been overthrown,
  And thou hast overthrown me, and my pride
  Is broken down, for Enid sees my fall!”          590
  And rising up, he rode to Arthur’s court,
  And there the Queen forgave him easily.
  And being young, he changed himself, and grew
  To hate the sin that seem’d so like his own
  Of Modred, Arthur’s nephew, and fell at last          595
  In the great battle fighting for the King.

    But when the third day from the hunting-morn
  Made a low splendour in the world, and wings
  Moved in her ivy, Enid, for she lay
  With her fair head in the dim yellow light,          600
  Among the dancing shadows of the birds,
  Woke and bethought her of her promise given
  No later than last eve to Prince Geraint—
  So bent he seem’d on going the third day,
  He would not leave her, till her promise given—          605
  To ride with him this morning to the court,
  And there be made known to the stately Queen,
  And there be wedded with all ceremony.
  At this she cast her eyes upon her dress,
  And thought it never yet had look’d so mean.          610
  For as a leaf in mid-November is
  To what it was in mid-October, seem’d
  The dress that now she look’d on to the dress
  She look’d on ere the coming of Geraint.
  And still she look’d, and still the terror grew          615
  Of that strange bright and dreadful thing, a court,
  All staring at her in her faded silk;
  And softly to her own sweet heart she said;

    “This noble prince who won our earldom back,
  So splendid in his acts and his attire,          620
  Sweet heaven, how much I shall discredit him!
  Would he could tarry with us here awhile,
  But being so beholden to the Prince,
  It were but little grace in any of us,
  Bent as he seem’d on going this third day,          625
  To seek a second favour at his hands.
  Yet if he could but tarry a day or two,
  Myself would work eye dim, and finger lame,
  Far liefer than so much discredit him.”

    And Enid fell in longing for a dress          630
  All branch’d and flower’d with gold, a costly gift
  Of her good mother, given her on the night
  Before her birthday, three sad years ago,
  That night of fire, when Edyrn sack’d their house,
  And scatter’d all they had to all the winds:          635
  For while the mother show’d it, and the two
  Were turning and admiring it, the work
  To both appear’d so costly, rose a cry
  That Edyrn’s men were on them, and they fled
  With little save the jewels they had on,          640
  Which being sold and sold had bought them bread:
  And Edyrn’s men had caught them in their flight,
  And placed them in this ruin; and she wish’d
  The Prince had found her in her ancient home;
  Then let her fancy flit across the past,          645
  And roam the goodly places that she knew;
  And last bethought her how she used to watch,
  Near that old home, a pool of golden carp;
  And one was patch’d and blurr’d and lustreless
  Among his burnish’d brethren of the pool;          650
  And half asleep she made comparison
  Of that and these to her own faded self
  And the gay court, and fell asleep again;
  And dreamt herself was such a faded form
  Among her burnish’d sisters of the pool;          655
  But this was in the garden of a king;
  And though she lay dark in the pool, she knew
  That all was bright; that all about were birds
  Of sunny plume in gilded trellis-work;
  That all the turf was rich in plots that look’d          660
  Each like a garnet or a turkis in it;
  And lords and ladies of the high court went
  In silver tissue talking things of state;
  And children of the King in cloth of gold
  Glanced at the doors or gamboll’d down the walks;          665
  And while she thought, “They will not see me,” came
  A stately queen whose name was Guinevere,
  And all the children in their cloth of gold
  Ran to her, crying, “If we have fish at all
  Let them be gold; and charge the gardeners now          670
  To pick the faded creature from the pool.
  And cast it on the mixen that it die.”
  And therewithal one came and seized on her,
  And Enid started, waking, with her heart
  All overshadow’d by the foolish dream,          675
  And lo! it was her mother grasping her
  To get her well awake: and in her hand
  A suit of bright apparel, which she laid
  Flat on the couch, and spoke exultingly:

    “See here, my child, how fresh the colours look,          680
  How fast they hold like colours of a shell
  That keeps the wear and polish of the wave!
  Why not? It never yet was worn, I trow:
  Look on it, child, and tell me if you know it.”

    And Enid look’d, but all confus’d at first,          685
  Could scarce divide it from her foolish dream;
  Then suddenly she knew it and rejoiced,
  And answer’d, “Yea, I know it; your good gift,
  So sadly lost on that unhappy night;
  Your own good gift!” “Yea, surely,” said the dame,          690
  “And gladly given again this happy morn.
  For when the jousts were ended yesterday,
  Went Yniol through the town, and everywhere
  He found the sack and plunder of our house
  All scatter’d through the houses of the town;          695
  And gave command that all which once was ours
  Should now be ours again: and yester-eve,
  While you were talking sweetly with your Prince,
  Came one with this and laid it in my hand,
  For love or fear, or seeking favour of us,          700
  Because we have our Earldom back again.
  And yester-eve I would not tell you of it,
  But kept it for a sweet surprise at morn.
  Yea, truly is it not a sweet surprise?
  For I myself unwillingly have worn          705
  My faded suit, as you, my child, have yours,
  And howsoever patient, Yniol his.
  Ah, dear, he took me from a goodly house,
  With store of rich apparel, sumptuous fare,
  And page, and maid, and squire, and seneschal,          710
  And pastime both of hawk and hound, and all
  That appertains to noble maintenance.
  Yea, and he brought me to a goodly house;
  But since our fortune slipt from sun to shade,
  And all through that young traitor, cruel need          715
  Constrain’d us, but a better time has come;
  So clothe yourself in this, that better fits
  Our mended fortunes and a Prince’s bride:
  For though you won the prize of fairest fair,
  And though I heard him call you fairest fair,          720
  Let never maiden think, however fair,
  She is not fairer in new clothes than old.
  And should some great court-lady say, the Prince
  Hath pick’d a ragged-robin from the hedge,
  And like a madman brought her to the court,          725
  Then were you shamed, and, worse, might shame the Prince
  To whom we are beholden; but I know,
  When my dear child is set forth at her best,
  That neither court nor country, though they sought
  Through all the provinces like those of old          730
  That lighted on Queen Esther, has her match.”

    Here ceased the kindly mother out of breath;
  And Enid listen’d brightening as she lay;
  Then, as the white and glittering star of morn
  Parts from a bank of snow, and by and by          735
  Slips into golden cloud, the maiden rose,
  And left her maiden couch, and robed herself,
  Help’d by the mother’s careful hand and eye,
  Without a mirror, in the gorgeous gown;
  Who, after, turn’d her daughter round and said,          740
  She never yet had seen her half so fair;
  And call’d her like that maiden in the tale,
  Whom Gwydion made by glamour out of flowers,
  And sweeter than the bride of Cassivelaun,
  Flur, for whose love the Roman Cæsar first          745
  Invaded Britain, “But we beat him back,
  As this great Prince invaded us, and we,
  Not beat him back, but welcomed him with joy.
  And I can scarcely ride with you to court,
  For old am I, and rough the ways and wild;          750
  But Yniol goes, and I full oft shall dream
  I see my princess as I see her now,
  Clothed with my gift, and gay among the gay.”

    But while the women thus rejoiced, Geraint
  Woke where he slept in the high hall, and call’d          755
  For Enid; and when Yniol made report
  Of that good mother making Enid gay
  In such apparel as might well beseem
  His princess, or indeed the stately Queen,
  He answer’d: “Earl, entreat her by my love,          760
  Albeit I give no reason but my wish,
  That she ride with me in her faded silk.”
  Yniol with that hard message went; it fell
  Like flaws in summer laying lusty corn:
  For Enid, all abash’d she knew not why,          765
  Dared not to glance at her good mother’s face,
  But silently, in all obedience,
  Her mother silent too, nor helping her,
  Laid from her limbs the costly-broider’d gift,
  And robed them in her ancient suit again,          770
  And so descended. Never man rejoiced
  More than Geraint to greet her thus attired;
  And glancing all at once as keenly at her
  As careful robins eye the delver’s toil,
  Made her cheek burn and either eyelid fall,          775
  But rested with her sweet face satisfied;
  Then seeing cloud upon the mother’s brow,
  Her by both hands he caught, and sweetly said:

    “O my new mother, be not wroth or grieved
  At your new son, for my petition to her.          780
  When late I left Caerleon, our great Queen,
  In words whose echo lasts, they were so sweet,
  Made promise, that whatever bride I brought,
  Herself would clothe her like the sun in Heaven.
  Thereafter, when I reach’d this ruin’d hold,          785
  Beholding one so bright in dark estate,
  I vow’d that could I gain her, our kind Queen,
  No hand but hers, should make your Enid burst
  Sunlike from cloud—and likewise thought, perhaps,
  That service done so graciously would bind          790
  The two together; for I wish the two
  To love each other: how should Enid find
  A nobler friend? Another thought I had;
  I came among you here so suddenly,
  That though her gentle presence at the lists          795
  Might well have served for proof that I was loved,
  I doubted whether filial tenderness,
  Or easy nature, did not let itself
  Be moulded by your wishes for her weal;
  Or whether some false sense in her own self          800
  Of my contrasting brightness, overbore
  Her fancy dwelling in this dusky hall;
  And such a sense might make her long for court
  And all its dangerous glories: and I thought,
  That could I someway prove such force in her          805
  Link’d with such love for me, that at a word
  (No reason given her) she could cast aside
  A splendour dear to women, new to her,
  And therefore dearer; or if not so new,
  Yet therefore tenfold dearer by the power          810
  Of intermitted custom; then I felt
  That I could rest, a rock in ebbs and flows,
  Fix’d on her faith. Now, therefore, I do rest,
  A prophet certain of my prophecy,
  That never shadow of mistrust can cross          815
  Between us. Grant me pardon for my thoughts;
  And for my strange petition I will make
  Amends hereafter by some gaudy-day,
  When your fair child shall wear your costly gift
  Beside your own warm hearth, with, on her knees,          820
  Who knows? another gift of the high God,
  Which, maybe, shall have learn’d to lisp you thanks.”

    He spoke: the mother smil’d, but half in tears,
  Then brought a mantle down and wrapt her in it,
  And claspt and kiss’d her, and they rode away.          825

    Now thrice that morning Guinevere had climb’d
  The giant tower, from whose high crest, they say,
  Men saw the goodly hills of Somerset,
  And white sails flying on the yellow sea;
  But not to goodly hill or yellow sea          830
  Look’d the fair Queen, but up the vale of Usk,
  By the flat meadow, till she saw them come;
  And then descending met them at the gates,
  Embrac’d her with all welcome as a friend,
  And did her honour as the Prince’s bride,          835
  And cloth’d her for her bridals like the sun;
  And all that week was old Caerleon gay,
  For by the hands of Dubric, the high saint,
  They twain were wedded with all ceremony.

    And this was on the last year’s Whitsuntide.          840
  But Enid ever kept the faded silk,
  Remembering how first he came on her,
  Drest in that dress, and how he loved her in it,
  And all her foolish fears about the dress,
  And all his journey toward her, as himself          845
  Had told her, and their coming to the court.

    And now this morning when he said to her,
  “Put on your worst and meanest dress,” she found
  And took it, and array’d herself therein.

                 *        *        *        *        *




                    =ODE ON THE DEATH OF THE DUKE OF
                              WELLINGTON.=


                           PUBLISHED IN 1852.


              I.

  Bury the Great Duke
    With an empire’s lamentation,
  Let us bury the Great Duke
    To the noise of the mourning of a mighty nation,
  Mourning when their leaders fall,          5
  Warriors carry the warrior’s pall,
  And sorrow darkens hamlet and hall.

              II.

  Where shall we lay the man whom we deplore?
  Here, in streaming London’s central roar.
  Let the sound of those he wrought for,          10
  And the feet of those he fought for,
  Echo round his bones for evermore.

              III.

  Lead out the pageant: sad and slow,
  As fits an universal woe,
  Let the long long procession go,          15
  And let the sorrowing crowd about it grow,
  And let the mournful martial music blow;
  The last great Englishman is low.

              IV.

  Mourn, for to us he seems the last,
  Remembering all his greatness in the Past.          20
  No more in soldier fashion will he greet
  With lifted hand the gazer in the street.
  O friends, our chief state-oracle is mute:
  Mourn for the man of long-enduring blood,
  The statesman-warrior, moderate, resolute,          25
  Whole in himself, a common good.
  Mourn for the man of amplest influence,
  Yet clearest of ambitious crime,
  Our greatest yet with least pretence,
  Great in council and great in war,          30
  Foremost captain of his time,
  Rich in saving common-sense,
  And, as the greatest only are,
  In his simplicity sublime.
  O good gray head which all men knew,          35
  O voice from which their omens all men drew,
  O iron nerve to true occasion true,
  O fall’n at length that tower of strength
  Which stood four-square to all the winds that blew!
  Such was he whom we deplore.          40
  The long self-sacrifice of life is o’er.
  The great World-victor’s victor will be seen no more.

              V.

  All is over and done:
  Render thanks to the Giver,
  England, for thy son.          45
  Let the bell be toll’d.
  Render thanks to the Giver,
  And render him to the mould.
  Under the cross of gold
  That shines over city and river,          50
  There he shall rest for ever
  Among the wise and the bold.
  Let the bell be toll’d:
  And a reverent people behold
  The towering car, the sable steeds:          55
  Bright let it be with its blazon’d deeds,
  Dark in its funeral fold.
  Let the bell be toll’d:
  And a deeper knell in the heart be knoll’d;
  And the sound of the sorrowing anthem roll’d          60
  Thro’ the dome of the golden cross;
  And the volleying cannon thunder his loss;
  He knew their voices of old.
  For many a time in many a clime
  His captain’s-ear has heard them boom          65
  Bellowing victory, bellowing doom:
  When he with those deep voices wrought,
  Guarding realms and kings from shame;
  With those deep voices our dead captain taught
  The tyrant, and asserts his claim          70
  In that dread sound to the great name,
  Which he has worn so pure of blame,
  In praise and in dispraise the same,
  A man of well-attemper’d frame.
  O civic muse, to such a name,          75
  To such a name for ages long,
  To such a name,
  Preserve a broad approach of fame,
  And ever-ringing[1] avenues of song.

              VI.

  Who is he that cometh, like an honour’d guest,          80
  With banner and with music, with soldier and with priest,
  With a nation weeping, and breaking on my rest?
  Mighty Seaman, this is he
  Was great by land as thou by sea.
  Thine island loves thee well, thou famous man,          85
  The greatest sailor since our world began.
  Now, to the roll of muffled drums,
  To thee the greatest soldier comes;
  For this is he
  Was great by land as thou by sea;          90
  His foes were thine; he kept us free;
  O give him welcome, this is he
  Worthy of our gorgeous rites,
  And worthy to be laid by thee;
  For this is England’s greatest son,          95
  He that gain’d a hundred fights,
  Nor ever lost an English gun;
  This is he that far away
  Against the myriads of Assaye
  Clash’d with his fiery few and won;          100
  And underneath another sun,
  Warring on a later day,
  Round affrighted Lisbon drew
  The treble works, the vast designs
  Of his labour’d rampart-lines,          105
  Where he greatly stood at bay,
  Whence he issued forth anew,
  And ever great and greater grew
  Beating from the wasted vines
  Back to France her banded swarms,          110
  Back to France with countless blows,
  Till o’er the hills her eagles flew
  Beyond the Pyrenean pines,
  Follow’d up in valley and glen
  With blare of bugle, clamour of men,          115
  Roll of cannon and clash of arms,
  And England pouring on her foes.
  Such a war had such a close.
  Again their ravening eagle rose
  In anger, wheel’d on Europe-shadowing wings,          120
  And barking for the thrones of kings;
  Till one that sought but Duty’s iron crown
  On that loud sabbath shook the spoiler down;
  A day of onsets of despair!
  Dash’d on every rocky square          125
  Their surging charges foam’d themselves away;
  Last, the Prussian trumpet blew;
  Thro’ the long-tormented air
  Heaven flash’d a sudden jubilant ray,
  And down we swept and charged and overthrew.          130
  So great a soldier taught us there,
  What long-enduring hearts could do
  In that world-earthquake, Waterloo!
  Mighty Seaman, tender and true,
  And pure as he from taint of craven guile,          135
  O saviour of the silver-coasted isle,
  O shaker of the Baltic and the Nile,
  If aught of things that here befall
  Touch a spirit among things divine,
  If love of country move thee there at all,          140
  Be glad, because his bones are laid by thine!
  And thro’ the centuries let a people’s voice
  In full acclaim,
  A people’s voice,
  The proof and echo of all human fame,          145
  A people’s voice, when they rejoice
  At civic revel and pomp and game,
  Attest their great commander’s claim
  With honour, honour, honour, honour to him,
  Eternal honour to his name.          150

              VII.

  A people’s voice! we are a people yet.
  Tho’ all men else their nobler dreams forget,
  Confused by brainless mobs and lawless powers;
  Thank Him who isled us here, and roughly set
  His Saxon[2] in blown seas and storming showers,          155
  We have a voice, with which to pay the debt
  Of boundless love and reverence and regret
  To those great men who fought, and kept it ours.
  And keep it ours, O God, from brute control;
  O Statesmen, guard us, guard the eye, the soul          160
  Of Europe, keep our noble England whole,
  And save the one true seed of freedom sown
  Betwixt a people and their ancient throne,
  That sober freedom out of which there springs
  Our loyal passion for our temperate kings;          165
  For, saving that, ye help to save mankind
  Till public wrong be crumbled into dust,
  And drill the raw world for the march of mind,
  Till crowds at length be sane and crowns be just.
  But wink no more in slothful overtrust.          170
  Remember him who led your hosts;
  He bad you guard the sacred coasts.
  Your cannons moulder on the seaward wall;
  His voice is silent in your council-hall
  For ever; and whatever tempests lour          175
  For ever silent; even if they broke
  In thunder, silent; yet remember all
  He spoke among you, and the Man who spoke;
  Who never sold the truth to serve the hour,
  Nor palter’d with Eternal God for power;          180
  Who let the turbid streams of rumour flow
  Thro’ either babbling world of high and low;
  Whose life was work, whose language rife
  With rugged maxims hewn from life;
  Who never spoke against a foe;          185
  Whose eighty winters freeze with one rebuke
  All great self-seekers trampling on the right:
  Truth-teller was our England’s Alfred named;
  Truth-lover was our English Duke;
  Whatever record leap to light          190
  He never shall be shamed.

              VIII.

  Lo, the leader in these glorious wars
  Now to glorious burial slowly borne,
  Follow’d by the brave of other lands,
  He, on whom from both her open hands          195
  Lavish Honour shower’d all her stars,
  And affluent Fortune emptied all her horn.
  Yea, let all good things await
  Him who cares not to be great,
  But as he saves or serves the state.          200
  Not once or twice in our rough island-story,
  The path of duty was the way to glory:
  He that walks it, only thirsting
  For the right, and learns to deaden
  Love of self, before his journey closes,          205
  He shall find the stubborn thistle bursting
  Into glossy purples, which outredden
  All voluptuous garden-roses.
  Not once or twice in our fair island-story,
  The path of duty was the way to glory:          210
  He, that ever following her commands,
  On with toil of heart and knees and hands,
  Thro’ the long gorge to the far light has won
  His path upward, and prevail’d,
  Shall find the toppling crags of Duty scaled          215
  Are close upon the shining table-lands
  To which our God Himself is moon and sun.
  Such was he: his work is done.
  But while the races of mankind endure,
  Let his great example stand          220
  Colossal, seen of every land,
  And keep the soldier firm, the statesman pure:
  Till in all lands and thro’ all human story
  The path of duty be the way to glory:
  And let the land whose hearths he saved from shame
  For many and many an age proclaim          226
  At civic revel and pomp and game,
  And when the long-illumined cities flame,
  Their ever-loyal iron leader’s fame,
  With honour, honour, honour, honour to him,          230
  Eternal honour to his name.

              IX.

  Peace, his triumph will be sung
  By some yet unmoulded tongue
  Far on in summers that we shall not see:
  Peace, it is a day of pain          235
  For one about whose patriarchal knee
  Late the little children clung:
  O peace, it is a day of pain
  For one, upon whose hand and heart and brain
  Once the weight and fate of Europe hung.          240
  Ours the pain, be his the gain!
  More than is of man’s degree
  Must be with us, watching here
  At this, our great solemnity.
  Whom we see not we revere;          245
  We revere, and we refrain
  From talk of battles loud and vain,
  And brawling memories all too free
  For such a wise humility
  As befits a solemn fane:          250
  We revere, and while we hear
  The tides of Music’s golden sea
  Setting toward eternity,
  Uplifted high in heart and hope are we,
  Until we doubt not that for one so true          255
  There must be other nobler work to do
  Than when he fought at Waterloo,
  And Victor he must ever be.
  For tho’ the Giant Ages heave the hill
  And break the shore, and evermore          260
  Make and break, and work their will;
  Tho’ world on world in myriad myriads roll
  Round us, each with different powers,
  And other forms of life than ours,
  What know we greater than the soul?          265
  On God and Godlike men we build our trust.
  Hush, the Dead March wails in the people’s ears:
  The dark crowd moves, and there are sobs and tears:
  The black earth yawns: the mortal disappears;
  Ashes to ashes, dust to dust;          270
  He is gone who seem’d so great,—
  Gone; but nothing can bereave him
  Of the force he made his own
  Being here, and we believe him
  Something far advanced in State,          275
  And that he wears a truer crown
  Than any wreath that man can weave him.
  Speak no more of his renown,
  Lay your earthly fancies down,
  And in the vast cathedral leave him,          280
  God accept him, Christ receive him.

-----

[1]  See note on this line.

[2]  See note on this line.

                 *        *        *        *        *




                            =THE DAY DREAM.=


       THE SLEEPING PALACE.

               I.

  The varying year with blade and sheaf
    Clothes and reclothes the happy plains;
  Here rests the sap within the leaf,
    Here stays the blood along the veins.
  Faint shadows, vapours lightly curl’d,          5
    Faint murmurs from the meadows come,
  Like hints and echoes of the world
    To spirits folded in the womb.

               II.

  Soft lustre bathes the range of urns
    On every slanting terrace-lawn.          10
  The fountain to his place returns
    Deep in the garden lake withdrawn.
  Here droops the banner on the tower,
    On the hall-hearths the festal fires,
  The peacock in his laurel bower,          15
    The parrot in his gilded wires.

               III.

  Roof-haunting martins warm their eggs:
    In these, in those the life is stay’d.
  The mantles from the golden pegs
    Droop sleepily: no sound is made,—          20
  Not even of a gnat that sings.
    More like a picture seemeth all
  Than those old portraits of old kings,
    That watch the sleepers from the wall.

               IV.

  Here sits the Butler with a flask          25
    Between his knees, half-drain’d; and there
  The wrinkled steward at his task,
    The maid-of-honour blooming fair:
  The page has caught her hand in his:
    Her lips are sever’d as to speak:          30
  His own were pouted to a kiss:
    The blush is fix’d upon her cheek.

               V.

  Till all the hundred summers pass,
    The beams that thro’ the Oriel shine,
  Make prisms in every carven glass,          35
    And beaker brimm’d with noble wine.
  Each baron at the banquet sleeps,
    Grave faces gather’d in a ring.
  His state the king reposing keeps,
    He must have been a jovial king.          40

               VI.

  All round a hedge upshoots, and shows
    At distance like a little wood;
  Thorns, ivies, woodbine, mistletoes,
    And grapes with bunches red as blood;
  All creeping plants, a wall of green          45
    Close-matted, bur and brake and briar,
  And glimpsing over these, just seen,
    High up, the topmost palace-spire.

               VII.

  When will the hundred summers die,
    And thought and time be born again,          50
  And newer knowledge, drawing nigh,
    Bring truth that sways the soul of men?
  Here all things in their place remain,
    As all were order’d, ages since.
  Come, Care and Pleasure, Hope and Pain,          55
    And bring the fated fairy Prince.


       THE SLEEPING BEAUTY.

               I.

  Year after year unto her feet,
    She lying on her couch alone
  Across the purpled coverlet,
    The maiden’s jet-black hair has grown,          60
  On either side her tranced form
    Forth streaming from a braid of pearl:
  The slumbrous light is rich and warm,
    And moves not on the rounded curl.

               II.

  The silk star-broidered coverlid          65
    Unto her limbs itself doth mould
  Languidly ever; and, amid
    Her full black ringlets downward roll’d,
  Glows forth each softly-shadow’d arm
    With bracelets of the diamond bright:          70
  Her constant beauty doth inform
    Stillness with love, and day with light.

               III.

  She sleeps: her breathings are not heard
    In palace chambers far apart.
  The fragrant tresses are not stirr’d          75
    That lie upon her charmed heart.
  She sleeps: on either hand upswells
    The gold-fringed pillow lightly prest:
  She sleeps, nor dreams, but ever dwells
    A perfect form in perfect rest.          80


          THE ARRIVAL.

               I.

  All precious things, discover’d late,
    To those who seek them issue forth;
  For love in sequel works with fate,
    And draws the veil from hidden worth.
  He travels far from other skies—          85
    His mantle glitters on the rocks—
  A fairy Prince, with joyful eyes,
    And lighter-footed than the fox.

               II.

  The bodies and the bones of those
    That strove in other days to pass,          90
  Are wither’d in the thorny close,
    Or scatter’d blanching on the grass.
  He gazes on the silent dead:
    ‘They perish’d in their daring deeds.’
  This proverb flashes thro’ his head,          95
    ‘The many fail: the one succeeds.’

               III.

  He comes, scarce knowing what he seeks:
    He breaks the hedge: he enters there:
  The colour flies into his cheeks:
    He trusts to light on something fair;          100
  For all his life the charm did talk
    About his path, and hover near
  With words of promise in his walk,
    And whisper’d voices in his ear.

               IV.

  More close and close his footsteps wind;          105
    The Magic Music in his heart
  Beats quick and quicker, till he find
    The quiet chamber far apart.
  His spirit flatters like a lark,
    He stoops—to kiss her—on his knee.          110
  ‘Love, if thy tresses be so dark,
    How dark those hidden eyes must be!’


          THE REVIVAL.

               I.

  A touch, a kiss! the charm was snapt.
    There rose a noise of striking clocks;
  And feet that ran, and doors that clapt,          115
    And barking dogs, and crowing cocks;
  A fuller light illumined all,
    A breeze thro’ all the garden swept,
  A sudden hubbub shook the hall,
    And sixty feet the fountain leapt.          120

               II.

  The hedge broke in, the banner blew,
    The butler drank, the steward scrawl’d,
  The fire shot up, the martin flew,
    The parrot scream’d, the peacock squall’d,
  The maid and page renew’d their strife,          125
    The palace bang’d, and buzz’d and clackt,
  And all the long pent stream of life
    Dash’d downward in a cataract.

               III.

  And last with these the king awoke,
    And in his chair himself uprear’d,          130
  And yawn’d, and rubb’d his face, and spoke,
    ‘By holy rood, a royal beard!
  How say you? we have slept, my lords.
    My beard has grown into my lap.’
  The barons swore, with many words,          135
    ’Twas but an after-dinner’s nap.

               IV.

  ‘Pardy,’ return’d the king, ‘but still
    My joints are something stiff or so.
  My lord, and shall we pass the bill
    I mention’d half an hour ago?’          140
  The chancellor, sedate and vain,
    In courteous words return’d reply:
  But dallied with his golden chain,
    And, smiling, put the question by.


        THE DEPARTURE.

               I.

  And on her lover’s arm she leant,          145
    And round her waist she felt it fold,
  And far across the hills they went
    In that new world which is the old:
  Across the hills, and far away
    Beyond their utmost purple rim,          150
  And deep into the dying day
    The happy princess follow’d him.

               II.

  ‘I’d sleep another hundred years,
    O love, for such another kiss;’
  ‘O wake for ever, love,’ she hears,          155
    ‘O love, ’twas such as this and this.’
  And o’er them many a sliding star,
    And many a merry wind was borne,
  And stream’d thro’ many a golden bar,
    The twilight melted into morn.          160

               III.

  ‘O eyes long laid in happy sleep!’
    ‘O happy sleep, that lightly fled!’
  ‘O happy kiss, that woke thy sleep!’
    ‘O love, thy kiss would wake the dead!’
  And o’er them many a flowing range          165
    Of vapour buoy’d the crescent-bark,
  And, rapt thro’ many a rosy change,
    The twilight died into the dark.

               IV.

  ‘A hundred summers! can it be?
    And whither goest thou, tell me where?’          170
  ‘O seek my father’s court with me,
    For there are greater wonders there.’
  And o’er the hills, and far away
    Beyond their utmost purple rim,
  Beyond the night, across the day,          175
    Thro’ all the world she follow’d him.


            MORAL.

               I.

  So, Lady Flora, take my lay,
    And if you find no moral there,
  Go, look in any glass and say,
    What moral is in being fair.          180
  Oh, to what uses shall we put
    The wildweed-flower that simply blows?
  And is there any moral shut
    Within the bosom of the rose?

               II.

  But any man that walks the mead,          185
    In bud or blade, or bloom, may find,
  According as his humours lead,
    A meaning suited to his mind.
  And liberal applications lie
    In Art like Nature, dearest friend;          190
  So ’twere to cramp its use, if I
    Should hook it to some useful end.

                 *        *        *        *        *




                 =‘YOU ASK ME, WHY, THO’ ILL AT EASE.’=


  You ask me, why, tho’ ill at ease,
      Within this region I subsist,
      Whose spirits falter in the mist,
  And languish for the purple seas.

  It is the land that freemen till,          5
      That sober-suited Freedom chose,
      The land, where girt with friends or foes
  A man may speak the thing he will;

  A land of settled government,
      A land of just and old renown,          10
      Where freedom slowly broadens down
  From precedent to precedent:

  Where faction seldom gathers head,
      But by degrees to fullness wrought,
      The strength of some diffusive thought          15
  Hath time and space to work and spread.

  Should banded unions persecute
      Opinion, and induce a time
      When single thought is civil crime,
  And individual freedom mute;          20

  Tho’ Power should make from land to land
      The name of Britain trebly great—
      Tho’ every channel of the State
  Should fill and choke with golden sand—

  Yet waft me from the harbour-mouth,          25
      Wild wind! I seek a warmer sky,
      And I will see before I die
  The palms and temples of the South.

                 *        *        *        *        *




                            =THE TRAVELLER.=


  Remote, unfriended, melancholy, slow,—
  Or by the lazy Scheldt or wandering Po;
  Or onward, where the rude Carinthian boor
  Against the houseless stranger shuts the door;
  Or where Campania’s plain forsaken lies,          5
  A weary waste expanding to the skies;—
  Where’er I roam, whatever realms to see,
  My heart untravell’d fondly turns to thee;
  Still to my brother turns, with ceaseless pain,
  And drags at each remove a lengthening chain.          10

    Eternal blessings crown my earliest friend,
  And round his dwelling guardian saints attend:
  Blest be that spot, where cheerful guests retire
  To pause from toil, and trim their evening fire;
  Blest that abode, where want and pain repair,          15
  And every stranger finds a ready chair;
  Blest be those feasts with simple plenty crown’d,
  Where all the ruddy family around
  Laugh at the jests or pranks that never fail,
  Or sigh with pity at some mournful tale,          20
  Or press the bashful stranger to his food,
  And learn the luxury of doing good.

    But me, not destin’d such delights to share,
  My prime of life in wandering spent and care—
  Impell’d, with steps unceasing, to pursue          25
  Some fleeting good, that mocks me with the view,—
  That, like the circle bounding earth and skies,
  Allures from far, yet, as I follow, flies,—
  My fortune leads to traverse realms alone,
  And find no spot of all the world my own.          30
  Ev’n now, where Alpine solitudes ascend,
  I sit me down a pensive hour to spend;
  And, plac’d on high above the storm’s career,
  Look downward where an hundred realms appear:
  Lakes, forests, cities, plains, extending wide,          35
  The pomp of kings, the shepherd’s humbler pride.

    When thus creation’s charms around combine,
  Amidst the store should thankless pride repine?
  Say, should the philosophic mind disdain
  That good which makes each humbler bosom vain?          40
  Let school-taught pride dissemble all it can,
  These little things are great to little man;
  And wiser he, whose sympathetic mind
  Exults in all the good of all mankind.
  Ye glittering towns, with wealth and splendor crown’d,          45
  Ye fields, where summer spreads profusion round,
  Ye lakes, whose vessels catch the busy gale,
  Ye bending swains, that dress the flowery vale;
  For me your tributary stores combine;
  Creation’s heir, the world—the world is mine!          50

    As some lone miser, visiting his store,
  Bends at his treasure, counts, recounts it o’er;
  Hoards after hoards his rising raptures fill,
  Yet still he sighs, for hoards are wanting still:
  Thus to my breast alternate passions rise,          55
  Pleas’d with each good that Heaven to man supplies:
  Yet oft a sigh prevails, and sorrows fall,
  To see the hoard of human bliss so small;
  And oft I wish, amidst the scene, to find
  Some spot to real happiness consign’d,          60
  Where my worn soul, each wandering hope at rest,
  May gather bliss to see my fellows blest.

    But where to find that happiest spot below,
  Who can direct, when all pretend to know?
  The shuddering tenant of the frigid zone          65
  Boldly proclaims that happiest spot his own;
  Extols the treasures of his stormy seas,
  And his long nights of revelry and ease;
  The naked negro, panting at the line,
  Boasts of his golden sands and palmy wine,          70
  Basks in the glare, or stems the tepid wave,
  And thanks his gods for all the good they gave.
  Such is the patriot’s boast, where’er we roam;
  His first, best country ever is at home.
  And yet, perhaps, if countries we compare,          75
  And estimate the blessings which they share,
  Though patriots flatter, still shall wisdom find
  An equal portion dealt to all mankind;
  As different good, by art or nature given,
  To different nations makes their blessings even.          80

    Nature, a mother kind alike to all,
  Still grants her bliss at labour’s earnest call;
  With food as well the peasant is supplied
  On Idra’s cliffs as Arno’s shelvy side;
  And, though the rocky-crested summits frown,          85
  These rocks by custom turn to beds of down.
  From art more various are the blessings sent:
  Wealth, commerce, honour, liberty, content.
  Yet these each other’s power so strong contest,
  That either seems destructive of the rest.          90
  Where wealth and freedom reign, contentment fails,
  And honour sinks where commerce long prevails.
  Hence every state, to one lov’d blessing prone,
  Conforms and models life to that alone;
  Each to the favourite happiness attends,          95
  And spurns the plan that aims at other ends;
  Till, carried to excess in each domain,
  This favourite good begets peculiar pain.

    But let us try these truths with closer eyes,
  And trace them through the prospect as it lies.          100
  Here for a while, my proper cares resign’d,
  Here let me sit in sorrow for mankind;
  Like yon neglected shrub, at random cast,
  That shades the steep, and sighs at every blast.

    Far to the right, where Apennine ascends,          105
  Bright as the summer, Italy extends;
  Its uplands sloping deck the mountain’s side,
  Woods over woods in gay theatric pride;
  While oft some temple’s mouldering tops between
  With venerable grandeur mark the scene.          110

    Could nature’s bounty satisfy the breast,
  The sons of Italy were surely blest.
  Whatever fruits in different climes are found,
  That proudly rise, or humbly court the ground;
  Whatever blooms in torrid tracts appear,          115
  Whose bright succession decks the varied year;
  Whatever sweets salute the northern sky
  With vernal lives, that blossom but to die;
  These, here disporting, own the kindred soil,
  Nor ask luxuriance from the planter’s toil;          120
  While sea-born gales their gelid wings expand
  To winnow fragrance round the smiling land.

    But small the bliss that sense alone bestows,
  And sensual bliss is all this nation knows.
  In florid beauty groves and fields appear,          125
  Man seems the only growth that dwindles here.
  Contrasted faults through all his manners reign:
  Though poor, luxurious; though submissive, vain;
  Though grave, yet trifling; zealous, yet untrue;
  And even in penance planning sins anew.          130
  All evils here contaminate the mind,
  That opulence departed leaves behind;
  For wealth was theirs, not far remov’d the date,
  When commerce proudly flourished through the state.
  At her command the palace learnt to rise,          135
  Again the long-fallen column sought the skies;
  The canvas glow’d beyond ev’n nature warm,
  The pregnant quarry teem’d with human form;
  Till, more unsteady than the southern gale,
  Commerce on other shores display’d her sail;          140
  While nought remain’d of all that riches gave,
  But towns unmann’d, and lords without a slave:
  And late the nation found, with fruitless skill,
  Its former strength was but plethoric ill.

    Yet still the loss of wealth is here supplied          145
  By arts, the splendid wrecks of former pride;
  From these the feeble heart and long-fallen mind
  An easy compensation seem to find.
  Here may be seen, in bloodless pomp array’d,
  The pasteboard triumph and the cavalcade;          150
  Processions form’d for piety and love,
  A mistress or a saint in every grove.
  By sports like these are all their cares beguil’d,
  The sports of children satisfy the child;
  Each nobler aim, represt by long control,          155
  Now sinks at last, or feebly mans the soul;
  While low delights, succeeding fast behind,
  In happier meanness occupy the mind.
  As in those domes where Cæsars once bore sway,
  Defac’d by time and tottering in decay,          160
  There in the ruin, heedless of the dead,
  The shelter-seeking peasant builds his shed;
  And, wondering man could want the larger pile,
  Exults, and owns his cottage with a smile.

    My soul, turn from them; turn we to survey          165
  Where rougher climes a nobler race display;
  Where the bleak Swiss their stormy mansion tread,
  And force a churlish soil for scanty bread.
  No product here the barren hills afford,
  But man and steel, the soldier and his sword;          170
  No vernal blooms their torpid rocks array,
  But winter lingering chills the lap of May;
  No zephyr fondly sues the mountain’s breast,
  But meteors glare, and stormy glooms invest.

    Yet still, even here, content can spread a charm,          175
  Redress the clime, and all its rage disarm.
  Though poor the peasant’s hut, his feasts though small,
  He sees his little lot the lot of all;
  Sees no contiguous palace rear its head
  To shame the meanness of his humble shed;          180
  No costly lord the sumptuous banquet deal
  To make him loathe his vegetable meal;
  But calm, and bred in ignorance and toil,
  Each wish contracting, fits him to the soil.
  Cheerful, at morn, he wakes from short repose,          185
  Breasts the keen air, and carols as he goes;
  With patient angle trolls the finny deep,
  Or drives his venturous plowshare to the steep;
  Or seeks the den where snow-tracks mark the way,
  And drags the struggling savage into day.          190
  At night returning, every labour sped,
  He sits him down, the monarch of a shed;
  Smiles by his cheerful fire, and round surveys
  His children’s looks, that brighten at the blaze,
  While his lov’d partner, boastful of her hoard,          195
  Displays her cleanly platter on the board;
  And haply too some pilgrim, thither led,
  With many a tale repays the nightly bed.

    Thus every good his native wilds impart,
  Imprints the patriot passion on his heart;          200
  And ev’n those hills that round his mansion rise
  Enhance the bliss his scanty fund supplies.
  Dear is that shed to which his soul conforms,
  And dear that hill which lifts him to the storms:
  And as a child, when scaring sounds molest,          205
  Clings close and closer to the mother’s breast,
  So the loud torrent and the whirlwind’s roar
  But bind him to his native mountains more.

    Such are the charms to barren states assign’d:
  Their wants but few, their wishes all confin’d.          210
  Yet let them only share the praises due;
  If few their wants, their pleasures are but few;
  For every want that stimulates the breast
  Becomes a source of pleasure when redrest.
  Whence from such lands each pleasing science flies,          215
  That first excites desire, and then supplies;
  Unknown to them, when sensual pleasures cloy,
  To fill the languid pause with finer joy;
  Unknown those powers that raise the soul to flame
  Catch every nerve, and vibrate through the frame:          220
  Their level life is but a smouldering fire,
  Unquench’d by want, unfann’d by strong desire;
  Unfit for raptures, or, if raptures cheer
  On some high festival of once a year,
  In wild excess the vulgar breast takes fire,          225
  Till, buried in debauch, the bliss expire.

    But not their joys alone thus coarsely flow;
  Their morals, like their pleasures, are but low.
  For, as refinement stops, from sire to son,
  Unalter’d, unimprov’d, the manners run;          230
  And love’s and friendship’s finely pointed dart
  Fall blunted from each indurated heart.
  Some sterner virtues o’er the mountain’s breast
  May sit, like falcons cowering on the nest;
  But all the gentler morals, such as play          235
  Through life’s more cultur’d walks, and charm the way,—
  These, far dispers’d, on timorous pinions fly,
  To sport and flutter in a kinder sky.

    To kinder skies, where gentler manners reign,
  I turn; and France displays her bright domain.          240
  Gay, sprightly land of mirth and social ease,
  Pleas’d with thyself, whom all the world can please,
  How often have I led thy sportive choir,
  With tuneless pipe, beside the murmuring Loire!
  Where shading elms along the margin grew,          245
  And freshen’d from the wave the zephyr flew;
  And haply, though my harsh touch, faltering still,
  But mock’d all tune, and marr’d the dancer’s skill,
  Yet would the village praise my wondrous power,
  And dance, forgetful of the noontide hour.          250
  Alike all ages: dames of ancient days
  Have led their children through the mirthful maze;
  And the gay grandsire, skill’d in gestic lore,
  Has frisk’d beneath the burthen of threescore.

    So blest a life these thoughtless realms display;          255
  Thus idly busy rolls their world away.
  Theirs are those arts that mind to mind endear,
  For honour forms the social temper here:
  Honour, that praise which real merit gains,
  Or even imaginary worth obtains,          260
  Here passes current; paid from hand to hand,
  It shifts in splendid traffic round the land;
  From courts, to camps, to cottages it strays,
  And all are taught an avarice of praise.
  They please, are pleas’d; they give to get esteem,          265
  Till, seeming blest, they grow to what they seem.

    But while this softer art their bliss supplies,
  It gives their follies also room to rise;
  For praise too dearly lov’d, or warmly sought
  Enfeebles all internal strength of thought:          270
  And the weak soul, within itself unblest,
  Leans for all pleasure on another’s breast.
  Hence ostentation here, with tawdry art,
  Pants for the vulgar praise which fools impart;
  Here vanity assumes her pert grimace,          275
  And trims her robes of frieze with copper lace;
  Here beggar pride defrauds her daily cheer,
  To boast one splendid banquet once a year:
  The mind still turns where shifting fashion draws,
  Nor weighs the solid worth of self-applause.          280

    To men of other minds my fancy flies,
  Embosom’d in the deep where Holland lies.
  Methinks her patient sons before me stand,
  Where the broad ocean leans against the land,
  And, sedulous to stop the coming tide,          285
  Lift the tall rampire’s artificial pride.
  Onward methinks, and diligently slow,
  The firm connected bulwark seems to grow,
  Spreads its long arms amidst the watery roar,
  Scoops out an empire, and usurps the shore.          290
  While the pent ocean, rising o’er the pile,
  Sees an amphibious world beneath him smile:
  The slow canal, the yellow-blossom’d vale,
  The willow-tufted bank, the gliding sail,
  The crowded mart, the cultivated plain,—          295
  A new creation rescued from his reign.

    Thus, while around the wave-subjected soil
  Impels the native to repeated toil,
  Industrious habits in each bosom reign,
  And industry begets a love of gain.          300
  Hence all the good from opulence that springs,
  With all those ills superfluous treasure brings,
  Are here display’d. Their much lov’d wealth imparts
  Convenience, plenty, elegance, and arts;
  But, view them closer, craft and fraud appear;          305
  Even liberty itself is bartered here.
  At gold’s superior charms all freedom flies;
  The needy sell it, and the rich man buys.
  A land of tyrants, and a den of slaves,
  Here wretches seek dishonorable graves,          310
  And calmly bent, to servitude conform,
  Dull as their lakes that slumber in the storm.

    Heavens! how unlike their Belgic sires of old—
  Rough, poor, content, ungovernably bold;
  War in each breast, and freedom on each brow;          315
  How much unlike the sons of Britain now!

    Fir’d at the sound, my genius spreads her wing,
  And flies where Britain courts the western spring,
  Where lawns extend that scorn Arcadian pride,
  And brighter streams than fam’d Hydaspes glide.          320
  There all around the gentlest breezes stray,
  There gentle music melts on every spray;
  Creation’s mildest charms are there combin’d:
  Extremes are only in the master’s mind!
  Stern o’er each bosom reason holds her state,          325
  With daring aims irregularly great;
  Pride in their port, defiance in their eye,
  I see the lords of human kind pass by;
  Intent on high designs, a thoughtful band,
  By forms unfashion’d, fresh from Nature’s hand,          330
  Fierce in their native hardiness of soul,
  True to imagin’d right, above control;
  While e’en the peasant boasts these rights to scan,
  And learns to venerate himself as man.

    Thine, Freedom, thine the blessings pictur’d here,          335
  Thine are those charms that dazzle and endear;
  Too blest, indeed, were such without alloy;
  But, foster’d e’en by freedom, ills annoy.
  That independence Britons prize too high
  Keeps man from man, and breaks the social tie;          340
  The self-dependent lordlings stand alone,
  All claims that bind and sweeten life unknown.
  Here, by the bonds of nature feebly held,
  Minds combat minds, repelling and repell’d;
  Ferments arise, imprison’d factions roar,          345
  Represt ambition struggles round her shore;
  Till, over-wrought, the general system feels
  Its motions stop, or frenzy fire the wheels.

    Nor this the worst. As nature’s ties decay,
  As duty, love, and honour fail to sway,          350
  Fictitious bonds, the bonds of wealth and law,
  Still gather strength, and force unwilling awe.
  Hence all obedience bows to these alone,
  And talent sinks, and merit weeps unknown;
  Till time may come, when, stript of all her charms,          355
  The land of scholars, and the nurse of arms,
  Where noble stems transmit the patriot flame,
  Where kings have toil’d and poets wrote for fame,
  One sink of level avarice shall lie,
  And scholars, soldiers, kings, unhonour’d die.          360

    Yet think not, thus when Freedom’s ills I state,
  I mean to flatter kings, or court the great:
  Ye powers of truth, that bid my soul aspire,
  Far from my bosom drive the low desire;
  And thou, fair Freedom, taught alike to feel          365
  The rabble’s rage, and tyrant’s angry steel;
  Thou transitory flower, alike undone
  By proud contempt, or favour’s fostering sun,
  Still may thy blooms the changeful clime endure!
  I only would repress them to secure:          370
  For just experience tells in every soil,
  That those who think must govern those who toil;
  And all that Freedom’s highest aims can reach,
  Is but to lay proportion’d loads on each.
  Hence, should one order disproportioned grow,          375
  Its double weight must ruin all below.

    Oh, then how blind to all that truth requires,
  Who think it freedom when a part aspires!
  Calm is my soul, nor apt to rise in arms,
  Except when fast approaching danger warms:          380
  But when contending chiefs blockade the throne,
  Contracting regal power to stretch their own;
  When I behold a factious band agree
  To call it freedom when themselves are free;
  Each wanton judge new penal statutes draw,          385
  Laws grind the poor, and rich men rule the law;
  The wealth of climes where savage nations roam,
  Pillag’d from slaves to purchase slaves at home;
  Fear, pity, justice, indignation, start,
  Tear off reserve, and bare my swelling heart;          390
  Till, half a patriot, half a coward grown,
  I fly from petty tyrants to the throne.

    Yes, brother, curse with me that baleful hour,
  When first ambition struck at regal power,
  And thus polluting honour in its source,          395
  Gave wealth to sway the mind with double force.
  Have we not seen, round Britain’s peopled shore,
  Her useful sons exchang’d for useless ore?
  Seen all her triumphs but destruction haste,
  Like flaring tapers brightening as they waste,          400
  Seen opulence, her grandeur to maintain,
  Lead stern depopulation in her train,
  And over fields where scatter’d hamlets rose,
  In barren, solitary pomp repose?
  Have we not seen, at pleasure’s lordly call,          405
  The smiling, long frequented village fall?
  Behold the duteous son, the sire decay’d,
  The modest matron, and the blushing maid,
  Forc’d from their homes, a melancholy train,
  To traverse climes beyond the western main;          410
  Where wild Oswego spreads her swamps around,
  And Niagara stuns with thundering sound?

    Even now, perhaps, as there some pilgrim strays
  Through tangled forests, and through dangerous ways,
  Where beasts with man divided empire claim,          415
  And the brown Indian marks with murderous aim;
  There, while above the giddy tempest flies,
  And all around distressful yells arise,
  The pensive exile, bending with his woe,
  To stop too fearful, and too faint to go,          420
  Casts a long look where England’s glories shine,
  And bids his bosom sympathize with mine.

    Vain, very vain, my weary search to find
  That bliss which only centres in the mind:
  Why have I stray’d from pleasure and repose,          425
  To seek a good each government bestows?
  In every government, though terrors reign,
  Though tyrant kings or tyrant laws restrain,
  How small, of all that human hearts endure,
  That part which laws or kings can cause or cure?          430
  Still to ourselves in every place consign’d,
  Our own felicity we make or find:
  With secret course, which no loud storms annoy
  Glides the smooth current of domestic joy.
  The lifted axe, the agonizing wheel,          435
  Luke’s iron crown, and Damiens’ bed of steel,
  To men remote from power but rarely known,
  Leave reason, faith, and conscience, all our own.

                 *        *        *        *        *




                     =HOME-THOUGHTS, FROM THE SEA.=


  Nobly, nobly Cape Saint Vincent to the north-west died away;
  Sunset ran, one glorious blood-red, reeking into Cadiz Bay;
  Bluish mid the burning water, full in face Trafalgar lay;
  In the dimmest north-east distance, dawned Gibraltar grand and gray;
  “Here and here did England help me—how can I help England?”—say,
    5
  Whoso turns as I, this evening, turn to God to praise and pray,
  While Jove’s planet rises yonder, silent over Africa.

                 *        *        *        *        *




                             =THE PATRIOT.=


                             AN OLD STORY.


               I.

  It was roses, roses, all the way,
    With myrtle mixed in my path like mad,
  The house-roofs seemed to heave and sway,
    The church-spires flamed, such flags they had,
  A year ago on this very day!          5

               II.

  The air broke into a mist with bells,
    The old walls rocked with the crowds and cries,
  Had I said, “Good folk, mere noise repels—
    But give me your sun from yonder skies!”
  They had answered, “And afterward, what else?”          10

               III.

  Alack, it was I who leaped at the sun,
    To give it my loving friends to keep.
  Nought man could do have I left undone,
    And you see my harvest, what I reap
  This very day, now a year is run.          15

               IV.

  There’s nobody on the house-tops now—
    Just a palsied few at the windows set—
  For the best of the sight is, all allow,
    At the Shambles’ Gate—or, better yet,
  By the very scaffold’s foot, I trow.          20

               V.

  I go in the rain, and, more than needs,
    A rope cuts both my wrists behind,
  And I think, by the feel, my forehead bleeds,
    For they fling, whoever has a mind,
  Stones at me for my year’s misdeeds.          25

               VI.

  Thus I entered, and thus I go!
    In triumphs, people have dropped down dead;
  “Thou, paid by the world,—what dost thou owe
    Me?” God might question: now instead
  ’Tis God shall repay! I am safer so.          30

                 *        *        *        *        *




                        =LOVE AMONG THE RUINS.=


  Where the quiet-coloured end of evening smiles
          Miles and miles
  On the solitary pastures where our sheep
          Half-asleep
  Tinkle homeward through the twilight, stray or stop          5
          As they crop—
  Was the site once of a city great and gay,
          (So they say)
  Of our country’s very capital, its prince
          Ages since          10
  Held his court in, gathered councils, wielding far
          Peace or war.

  Now—the country does not even boast a tree,
          As you see,
  To distinguish slopes of verdure, certain rills          15
          From the hills
  Intersect and give a name to, (else they run
          Into one,)
  Where the domed and daring palace shot its spires
          Up like fires          20
  O’er the hundred-gated circuit of a wall
          Bounding all,
  Made of marble, men might march on nor be pressed
          Twelve abreast.

  And such plenty and perfection, see, of grass          25
          Never was!
  Such a carpet as, this summer-time, o’erspreads
          And embeds
  Every vestige of the city, guessed alone,
          Stock or stone—          30
  Where a multitude of men breathed joy and woe
          Long ago;
  Lust of glory pricked their hearts up, dread of shame
          Struck them tame;
  And that glory and that shame alike, the gold          35
          Bought and sold.

  Now,—the single little turret that remains
          On the plains,
  By the caper overrooted, by the gourd
          Overscored,          40
  While the patching houseleek’s head of blossom winks
          Through the chinks—
  Marks the basement whence a tower in ancient time
          Sprang sublime,
  And a burning ring, all around, the chariots traced          45
          As they raced,
  And the monarch and his minions and his dames
          Viewed the games.

  And I know, while thus the quiet-coloured eve
          Smiles to leave          50
  To their folding, all our many-tinkling fleece
          In such peace,
  And the slopes and rills in undistinguished gray
          Melt away—
  That a girl with eager eyes and yellow hair          55
          Waits me there
  In the turret whence the charioteers caught soul
          For the goal,
  When the king looked, where she looks now, breathless, dumb
          Till I come.          60

  But he looked upon the city, every side,
          Far and wide,
  All the mountains topped with temples, all the glades’
          Colonnades,
  All the causeys, bridges, aqueducts,—and then,          65
          All the men!
  When I do come she will speak not, she will stand,
          Either hand
  On my shoulder, give her eyes the first embrace
          Of my face,          70
  Ere we rush, ere we extinguish sight and speech
          Each on each.

  In one year they sent a million fighters forth
          South and North,
  And they built their gods a brazen pillar high          75
          As the sky,
  Yet reserved a thousand chariots in full force—
          Gold, of course.
  Oh heart! oh blood that freezes, blood that burns!
          Earth’s returns          80
  For whole centuries of folly, noise and sin!
          Shut them in,
  With their triumphs and their glories and the rest!
          Love is best.

                 *        *        *        *        *




                         =THE ISLES OF GREECE.=


               I.

  The isles of Greece, the isles of Greece!
    Where burning Sappho loved and sung,
  Where grew the arts of war and peace,—
    Where Delos rose and Phœbus sprung!
  Eternal summer gilds them yet,          5
  But all, except their sun, is set.

               II.

  The Scian and the Teian muse,
    The hero’s harp, the lover’s lute,
  Have found the fame your shores refuse;
    Their place of birth alone is mute          10
  To sounds which echo further west
  Than your sires’ “Islands of the Blest.”

               III.

  The mountains look on Marathon—
    And Marathon looks on the sea;
  And musing there an hour alone,          15
    I dream’d that Greece might still be free;
  For standing on the Persians’ grave,
  I could not deem myself a slave.

               IV.

  A king sate on the rocky brow
    Which looks o’er sea-born Salamis;          20
  And ships, by thousands, lay below,
    And men in nations;—all were his!
  He counted them at break of day—
  And when the sun set, where were they?

               V.

  And where are they? and where art thou          25
    My country? On thy voiceless shore
  The heroic lay is tuneless now—
    The heroic bosom beats no more!
  And must thy lyre, so long divine,
  Degenerate into hands like mine?          30

               VI.

  ’Tis something, in the dearth of fame,
    Though link’d among a fetter’d race,
  To feel at least a patriot’s shame,
    Even as I sing, suffuse my face;
  For what is left the poet here?          35
  For Greeks a blush—for Greece a tear.

               VII.

  Must _we_ but weep o’er days more blest?
    Must _we_ but blush?—Our fathers bled.
  Earth! render back from out thy breast
    A remnant of our Spartan dead!          40
  Of the three hundred grant but three,
  To make a new Thermopylæ!

               VIII.

  What, silent still? and silent all?
    Ah! no;—the voices of the dead
  Sound like a distant torrent’s fall,          45
    And answer, “Let one living head,
  But one arise—we come, we come!”
  ’Tis but the living who are dumb.

               IX.

  In vain—in vain; strike other chords;
    Fill high the cup with Samian wine!          50
  Leave battles to the Turkish hordes,
    And shed the blood of Scio’s vine!
  Hark! rising to the ignoble call—
  How answers each bold Bacchanal!

               X.

  You have the Pyrrhic dance as yet,          55
    Where is the Pyrrhic phalanx gone?
  Of two such lessons why forget
    The nobler and the manlier one?
  You have the letters Cadmus gave—
  Think ye he meant them for a slave?          60

               XI.

  Fill high the bowl with Samian wine!
    We will not think of themes like these!
  It made Anacreon’s song divine:
    He served—but served Polycrates—
  A tyrant; but our masters then          65
  Were still, at least, our countrymen.

               XII.

  The tyrant of the Cheronese
    Was freedom’s best and bravest friend;
  _That_ tyrant was Miltiades!
    Oh! that the present hour would lend          70
  Another despot of the kind!
  Such chains as his were sure to bind.

               XIII.

  Fill high the bowl with Samian wine!
    On Suli’s rock, and Parga’s shore
  Exists the remnant of a line          75
    Such as the Doric mothers bore;
  And there, perhaps, some seed is sown,
  The Heracleidan blood might own.

               XIV.

  Trust not for freedom to the Franks—
    They have a king who buys and sells;          80
  In native swords, and native ranks,
    The only hope of courage dwells;
  But Turkish force, and Latin fraud,
  Would break your shield, however broad.

               XV.

  Fill high the bowl with Samian wine!          85
    Our virgins dance beneath the shade—
  I see their glorious black eyes shine;
    But gazing on each glowing maid,
  Mine own the burning tear-drop laves,
  To think such breasts must suckle slaves.          90

               XVI.

  Place me on Sunium’s marbled steep,
    Where nothing, save the waves and I,
  May hear our mutual murmurs sweep;
    There, swan-like, let me sing and die:
  A land of slaves shall ne’er be mine—          95
  Dash down yon cup of Samian wine!

                 *        *        *        *        *




                     =“AS SHIPS, BECALMED AT EVE.”=


  As ships, becalm’d at eve, that lay
    With canvas drooping, side by side,
  Two towers of sail at dawn of day
    Are scarce long leagues apart descried;

  When fell the night, upsprung the breeze,          5
    And all the darkling hours they plied,
  Nor dreamt but each the self-same seas
    By each was cleaving, side by side:

  E’en so—but why the tale reveal
    Of those, whom year by year unchanged,          10
  Brief absence join’d anew to feel,
    Astounded, soul from soul estranged?

  At dead of night their sails were fill’d,
    And onward each rejoicing steer’d—
  Ah, neither blame, for neither will’d,          15
    Or wist, what first with dawn appear’d!

  To veer, how vain! On, onward strain,
    Brave barks! In light, in darkness too,
  Through winds and tides one compass guides
    To that, and your own selves, be true.          20

  But O blithe breeze! and O great seas,
    Though ne’er, that earliest parting past,
  On your wide plain they join again,
    Together lead them home at last.

  One port, methought, alike they sought,          25
    One purpose hold where’er they fare,—
  O bounding breeze, O rushing seas!
    At last, at last, unite them there.

                 *        *        *        *        *




                       =THE CHAMBERED NAUTILUS.=


  This is the ship of pearl, which, poets feign,
              Sails the unshadowed main,—
              The venturous bark that flings
  On the sweet summer wind its purpled wings
  In gulfs enchanted, where the Siren sings,          5
              And coral reefs lie bare,
  Where the cold sea-maids rise to sun their streaming hair.

  Its webs of living gauze no more unfurl;
              Wrecked is the ship of pearl!
              And every chambered cell,          10
  Where its dim dreaming life was wont to dwell,
  As the frail tenant shaped his growing shell,
              Before thee lies revealed—
  Its irised ceiling rent, its sunless crypt unsealed!

  Year after year beheld the silent toil          15
              That spread his lustrous coil;
              Still, as the spiral grew,
  He left the past year’s dwelling for the new,
  Stole with soft step its shining archway through,
              Built up its idle door,          20
  Stretched in his last-found home and knew the old no more.

  Thanks for the heavenly message brought by thee,
              Child of the wandering sea,
              Cast from her lap forlorn!
  From thy dead lips a clearer note is born          25
  Than ever Triton blew from wreathèd horn!
              While on mine ear it rings,
  Through the deep caves of thought I hear a voice that sings:—

  Build thee more stately mansions, O my soul.
              As the swift seasons roll!          30
              Leave thy low-vaulted past!
  Let each new temple, nobler than the last,
  Shut thee from heaven with a dome more vast,
              Till thou at length art free,
  Leaving thine outgrown shell by life’s unresting sea!          35

                 *        *        *        *        *




                     =SELECTIONS FOR MEMORIZATION=


_Prescribed by the Department of Education, in the Province of Ontario._

                      (Extract from Circular 58).

                    =Junior Public School Diploma.=

                       _The High School Reader._

   The Knights’ Chorus, p. 70; The Evening Wind, p. 93; The Return of
the Swallows, p. 111; The Eternal Goodness, p. 118; Sir Galahad, p. 182;
On First Looking into Chapman’s Homer, p. 189; A Wood Lyric, p. 191.

                      _Narrative and Lyric Poems._

	_Gray_: Elegy, written in a Country Churchyard; _Mrs. Browning_: My
Kate; _Tennyson_: Morte d’Arthur, ll. 113-142, “Then spoke King Arthur
breathing heavily. . . so flashed and fell the brand Excalibur,” ll.
240-255, “The old order changeth. . . about the feet of God.”

      =Senior Public School Diploma, Senior High School Entrance,=
                 =and Entrance into the Model Schools.=

                      _Narrative and Lyric Poems._

   Home-Thoughts, from the Sea; “As Ships, Becalm’d—”; The Chambered
Nautilus; “You Ask me, Why—”; Enid’s song, “Turn, Fortune, turn thy
Wheel”—four stanzas; Ode on the Death of the Duke of Wellington, Parts
VII and VIII; The Traveller, ll. 63-98, “But where to find. . . peculiar
pain” and ll. 423-438, “Vain, very vain. . . all our own.”

                       _The Merchant of Venice._

Act I, Sc. 1, ll. 79-99.    _Gratiano_: Let me play . . . their brothers
                                        fools.
Act I, Sc. 2, ll. 13-22.    _Portia_:   If to do . . . the cripple.
Act II, Sc. 9, ll. 21-49.   _Arragon_:  Who chooseth me . . .
                                        new-varnished.
Act IV, Sc. 1, ll. 184-202. _Portia_:   The quality of mercy . . . deeds
                                        of mercy.
Act V, Sc. 1, ll. 54-65.    _Lorenzo_:  How sweet . . . cannot hear it.
Act V, Sc. 1, ll. 83-88.    _Lorenzo_:  The man that hath no music . . .
                                        trusted.

                 *        *        *        *        *




                                =NOTES.=


                              ENOCH ARDEN.

   Published in 1864.

2. Evidently a stream comes down through the chasm and the wide mouth of
the stream forms a harbour. See line 690.

3. =Beyond.= At one side of the harbour.

=red roofs.= Roofs covered with red tile.

6. =down.= A bare sandy hill.

7. =Danish barrows.= Burial mounds supposed to date back to the time of
the Danes.

16. =lumber.= Waste material; clumsy, useless articles.

17. =swarthy.= Black or brown in colour.

18. =fluke.= The hook or wing of the anchor.

25-6. A suggestion of what is to take place later in the lives of these
three.

38. The stronger passions of youth.

63. =great and small.= Old and young.

67. =prone.= Sloping down precipitously.

68. =To feather.= The wood was denser in the hollow (see line 444), than
along the upper edges of the slope.

84-8. Enoch Arden was “a rough sailor lad” without education; and
Tennyson throughout the poem tries to soften down the prosaic features
of his life and to picture him as a man with nobler impulses and
resolves.

92-100. An effort to dress up in more attractive form the prosaic fact
that Enoch made his living by peddling fish.

93. =ocean-spoil.= Fish.

94. =ocean-smelling osier.= Willow baskets having an odour of the sea.

96. =market-cross.= In old days crosses were frequently erected in
market places.

98. =portal-warding lion-whelp.= The carved figure of a lion placed over
the gateway as if to guard the entrance.

99. =peacock-yewtree.= A yewtree trimmed in the form of a peacock. The
yewtree is an evergreen.

100. Enoch provided the fish which were used on Friday.

110. He had competition in his trade.

128-31. A little cloud sometimes throws the sea into shadow around you,
but away on the horizon you see a bright spot (an isle of light) on the
water, which shows that the sun is shining there. So with Enoch. His
misfortune was a shadow on his life, but the future was bright and he
knew that the little cloud would pass away.

=the offing.= The part of the sea that lies some distance off the shore.

154. =Appraised.= Judged.

168. =his old sea-friend.= His boat.

172-81. Analyse grammatically.

184. =Save as his Annie’s.= He laughed at the fears themselves, but was
grieved that she should be troubled by fears.

186-7. =that mystery, etc.= In prayer the divine side of man’s nature
comes into communion with the human sympathy of God’s nature.

196. =Nay.= He sees that Annie does not like his words of seeming
disparagement.

212-3. Are these prophecies fulfilled?

222-6. Most of these phrases are taken from the Bible.

235-6. See lines 892-901.

248. =chime with.= Agree with; to carry out his wishes.

253. =still.= Always.

266. =who best could tell.= The physician.

286. =passion.= What is the predicate?

329. =garth.= Garden.

340. =conies.= Rabbits.

342. =the offence of charitable.= The offence of appearing to give
charity.

379. =whitening.= Showing the light underside of the leaves as the
children plunged through the bushes.

382. =tawny.= Yellowish-brown in colour.

414. =fast my wife.= Bound to me as my wife.

441. =dead flame.= The sun was no longer shining brightly on the barrow.

473. Annoyed that their calculations as to the marriage of Philip and
Annie had not come true.

493. She had prayed for a sign, but the expectation that some sign might
be sent filled her with terror and she could not endure it.

498. “And she dwelt under the palm tree of Deborah.”—_Judges_ iv., 5.

504. _Malachi_ iv., 2.

505-6. _Mark_ xi., 8-10.

510. =So.= If.

529. =the Biscay.= The Bay of Biscay.

531. =the summer of the world.= The tropics.

532. =the Cape.= The Cape of Good Hope.

536. =the golden isles.= The East Indies.

542. =sea-circle.= The circle of which the horizon formed the boundary.
This circle was constantly changing with the progress of the vessel.

543. =full-busted figurehead.= It was the custom to have a carved figure
or bust, generally the image of the Virgin, at the prow of the vessel.

557. =so wild that it was tame.= Never having seen human beings, they
had not learned to fear them.

569. =Fire-hollowing.= Burning out the centre with fire.

571. =God’s warning.= God’s warning that he could not help himself, that
he could only wait for help to come.

572. =lawns.= Open grassy spaces in the woods.

573. =glades.= Narrower spaces than lawns.

579. =broad belt.= The torrid zone.

586. =zenith.= The point in the heavens which is directly overhead.

597. =globed.= Suggests larger and more brilliant stars.

598. =hollower.= Because of the silence of the night.

602-605. Either the spirit of the old friends and scenes came to him, or
his spirit went out to them. Two ways of saying the same thing—that
there came before his mind the vague images of former scenes.

=many phantoms.= Many images went to make up the day dream.

610. =dewy-glooming.= Looking darker in the early morning because
covered with dew.

615. A suggestion that in some mysterious way the sound of the marriage
bells of Annie and Philip was borne to him.

633. =silent.= They were so far from the island that they could not hear
the sound of the waterfall.

640. =rage.= Because he could not make himself understood.

642. =sweet water.= Fresh water.

653. =county.= This word was changed to “country” in a later edition.

659. =down thro’ all his blood.= He breathed deeply of the air he loved.

661. =ghostly wall.= The white chalk cliffs of southern England.

670-2. Through both gorges there came up a mist from the sea. See lines
102-3.

675. =holt.= Woodland.

=tilth.= Tilled ground.

679. Why does the poet represent Enoch as returning in the thick mist
rather than in the bright sunshine?

688. =A bill of sale.= A notice that the house was for sale.

690. =pool.= Harbour.

692. =timber-crost antiquity.= Built in the old style, with the timbers
showing on the outside,—the spaces between being filled in with
plaster.

737. =shingle.= Gravel.

793. =tranced.= A trance is any state in which the bodily functions are
for the time suspended. Here Enoch is in a half-swoon.

797. =burthen.= A refrain or chorus. Strictly speaking, the word
signifies the bass accompaniment or undersong.

801-4. Just as fresh water from a spring in the ocean rises through the
salt water and keeps alive the mariner who drinks of it; so prayer
springing out of his resolve (will) never to let her know came up
through the bitterness of his life and “kept him a living soul.”

807. =enow.= Enough.

829. The lower edges of the cloud or mist which the wind lifts.

910. “The calling of the sea is a term used, I believe, chiefly in the
western parts of England, to signify a ground swell. When this occurs on
a windless night, the echo of it rings through the timbers of the old
houses in a haven.” (Tennyson.) A ground-swell is a heavy swell due to a
violent gale. It is often felt for some days afterwards and on shores
which are far distant from the scene of the storm.

                 *        *        *        *        *


                            MORTE D’ARTHUR.

   Published in 1842.

   _Morte D’Arthur_ (The Death of Arthur) is a story of King Arthur and
The Round Table, based on the legend entitled _Morte D’Arthur_, which
was written by Malory, an English writer of the sixteenth century. King
Arthur was a mythical king of the Britons who was supposed to have lived
and reigned in the sixth century, and to have united the Britons against
the Saxon invaders. According to legend he established a famous order of
knighthood known as The Order of The Round Table, so called because of
the famous round table, presented to King Arthur by a British king, and
capable of seating one hundred and fifty knights. In the course of time
the knights of the Round Table became corrupt and forgot their vows,
and, led by Modred, the king’s nephew, a number of them rose in
rebellion against the king. King Arthur with those knights who remained
loyal to him, drove the army of Modred step by step back into Cornwall
and beyond it into the land of Lyonnesse, which was said to have
extended from Cornwall to the Scilly Isles, but which has since been
submerged by the sea. Here in this waste land a great battle was fought,
in which the knights on both sides were killed, until at last only King
Arthur and his faithful knight Sir Bedivere remained.

5. In his fight with Modred, whom he slew, King Arthur had himself
received his death wound.

9. =chancel.= The part of the church set apart for the altar and the
choir.

12. =water.= Lake.

14. =The sequel of to-day.= The outcome of to-day’s fight.

21. =Camelot.= The mythical capital of King Arthur’s kingdom, situated
somewhere in the west of England. Malory identifies it with the city of
Winchester.

23. =Merlin.= A magician and seer of King Arthur’s court.

27. =Excalibur.= The name signifies “cut-steel.”

31. =samite.= A rich silk stuff, interwoven with threads of gold and
silver.

=mystic.= Having a secret religious significance.

37. =middle mere.= Middle of the lake.

38. =lightly.= Quickly, nimbly.

43. =hest.= Behest, command.

45. =shrine.= See lines 8 and 9.

46. =athwart.= Across.

56. =haft.= Handle.

57. =topaz.= A rich gem, generally of a yellowish colour.

=jacinth.= Another form of the word “hyacinth”; a gem of a red colour.

58. =subtlest jewellery.= Most cunning workmanship.

60. Looking swiftly now on one side of the question, now on the other.

63. =many-knotted water-flags.= The common iris, growing in tangled
confusion. Or “many-knotted” may refer to the joints in the stalk.

74-5. =as beseem’d thy fealty.= As became thy loyalty.

80. =lief.= Beloved.

86. =chased.= Engraved with an inlaid pattern.

94. Obedience is what binds the subject to the ruler.

99. =empty breath.= Idle words.

102. =joust= (pronounced _just_). A tilt-at-arms, a tournament.

104. =the lonely maiden of the Lake.= A mystical being who dwelt in a
wonderful cave in a rock within a lake. In the story of the Round Table
she symbolizes religion.

110. =clouded with his own conceit.= His idea that the sword should be
preserved as a relic prevented him from clearly seeing his duty.

=conceit.= A quaint fancy.

121-3. The dying king loses his authority because he has lost the
ability to control the will of his subjects by “the power in his eye.”

125. In whom the services of all my knights should be combined.

128. =giddy.= Light, frivolous.

139. =a streamer of the northern morn.= A trail of light from the Aurora
Borealis (literally “The Northern Dawn”).

140. =the moving isles of winter.= Icebergs.

170. =As in a picture.= With no change in the expression.

171. =Remorsefully.= With pity.

177. =nightmare.= A dream accompanied by a sensation of stifling. _Mare_
is derived from a verb meaning to crush, to bruise.

182. =Clothed with his breath.= Enveloped in the vapour from his breath
which condensed and congealed.

185. =His own thought.= His remorse for having deceived the king.

186. =Dry clashed his harness.= The echo of the sound of his armour was
harsh.

193. =hove.= Past tense of _heave_, to rise. A vessel _heaves_ in sight
when it rises over the horizon.

194. =scarf.= Drapery.

197. =Black-stoled.= With long black robes reaching to the feet.

=like a dream.= The scene had an appearance of unreality.

198. =Three Queens.= Malory speaks of the three Queens as being King
Arthur’s sister, Morgan le Fay; the Queen of Northgales (Wales); and the
Lady of the Lake. On the symbolic side, however, they represent Faith,
Hope and Charity.

199. =that shivered to the tingling stars.= So shrill that even the
stars tingled at the sound.

207. =she.= Charity.

209. =casque.= Helmet.

213-4. The waning moon which looks pale in the bright morning sunshine.

215-6. =greaves and cuisses.= Armour for the shins and thighs.

=dash’d with drops of onset.= Splash’d with stains of the battle.

218. =daïs-throne.= The daïs was the raised part of the hall; a
platform.

222. =in rest.= On the right side of the coat of mail was a projection
to support the lance when not in use.

224. =lists.= The enclosed ground in which the combats took place.

230. =a noble chance.= A chance to do some noble deed.

232-3. The star that led the Wise Men to Bethlehem. (See _Matthew_ ii.,
7-11.)

240. If old customs and institutions are changing it is only because new
and better ones are taking their place.

241-2. It is in accordance with God’s purpose and his nature that the
world should grow better. Changes are necessary, since even a good
custom will at length degenerate and become corrupt.

243. =what comfort is in me?= I cannot comfort you.

251. =a blind life.= A life without the power of reason.

255. =gold chains.= There existed an old fancy that the earth was
suspended from Heaven by a golden chain. Here, each prayer is a chain
binding earth to Heaven.

259. =Avilion.= A mythical island in the western ocean, in Celtic legend
the abode of the blessed after death.

263. =crown’d with summer sea.= Surrounded by the sea, as the head is
encircled by a crown.

267. The belief existed that the swan sang sweetly before her death.

268. =Ruffles.= Spreads out her feathers.

269. =swarthy web.= Dark webbed feet.

271. Note that even when the barge bearing King Arthur, who represented
“the old order” of things, was disappearing, a new day, with a new order
of things, was already dawning.

                 *        *        *        *        *


                        THE PRISONER OF CHILLON.

   The story of _The Prisoner of Chillon_ is founded on certain events
in the life of Francis Bonnivard, a Swiss patriot, who was imprisoned in
the Fortress of Chillon for six years. Bonnivard was born in 1496. He
belonged to a noble family, and inherited a rich priory near Geneva.
When the republic was attacked in 1519 by Charles III Duke of Savoy,
Bonnivard came to its defence. After many adventures he was taken
prisoner by the Duke in 1530, and consigned to the dungeon of Chillon.
He was liberated in 1536 when the castle fell into the hands of the
Swiss patriots. From this time until his death in 1571 he was prominent
in the affairs of the republic.

   Byron wrote this poem in 1816, a few days after visiting Chillon. At
that time he was not familiar with the true facts in the life of
Bonnivard and his story contains numerous details which have no
foundation in reality.

   The castle of Chillon is situated on a rock in Lake Geneva, and is
connected with the mainland by a bridge. It was built in 1218, and
served both as a fortress and a prison.

11. Bonnivard was imprisoned for political reasons, not on account of
his religion.

14. =tenets.= Beliefs.

25. Not historically true. Francis Bonnivard was the only one of his
family who was imprisoned in Chillon.

27. =seven pillars.= In reality there are eight, one of which is partly
built into the wall.

=Gothic.= A style of architecture introduced during the Middle Ages.
Among other characteristics it was marked by high pointed windows and
clustered pillars.

35. =a marsh’s meteor lamp.= The Will o’ the Wisp,—luminous gases
rising from the marsh.

38. =cankering.= Corroding.

52. =But.= Except.

=livid.= Leaden coloured; literally, black and blue.

57. =the pure elements of earth.= Such as pure water and sunlight.

84. =sleepless summer.= With no night to mark the hours for sleep.

85. The light shining on the snow is personified as the child of the
sun, clad in white.

95. =had stood.= Past subjunctive.

105. =a gulf.= An abyss.

107. =Lake Leman.= The Roman name for Lake Geneva.

108. The greatest depth of the lake is 1056 ft.

112. =enthrals.= Encompasses; holds captive.

121. =wanton.= Literally, without restraint; hence, playful.

131. =had little care.= Did not mind it.

138. =these.= The water and the bread.

141. =had grown cold.= Past subjunctive.

148. =gnash.= Literally, to strike or grind together. Does Byron mean
this?

153. =corse.= Corpse; a poetical form of the word.

172-3. He had shown thus far a high spirit, whether natural to him, or
something seemingly inspired.

181. The face swollen and working convulsively in the struggle for life.

208. =admonished.= Reproved. The knowledge that it was hopeless did not
prevent his fear.

214. =dungeon-dew.= The dampness of the dungeon.

230. =a selfish death.= Suicide.

237. =scarce conscious what I wist.= Scarcely conscious of what I knew.
_Conscious_ is an appositive, not a predicate adjective. The line
following is the completion of _was_.

=wist.= See High School Grammar, page 176.

238. Quite shut off from everything else.

243. He saw nothing. Vacancy absorbed all space.

244. =fixedness, without a place.= His attention was not fixed on any
definite thing; but yet his mind stood still, was inactive.

247-8. His breath was almost motionless. He seemed to have no life, yet
was not dead.

249-50. He compares his mind in this state of trance to a stagnant sea,
without light, limit, sound or movement.

256. =Ran over.= Shed tears.

257-8. Because filled with tears.

281. =thine.= Thy captivity.

284. Distinguish _visitant_ and _visitor_.

317. =fell blind.= Became suddenly blind.

327. =had made.= Past subjunctive.

330. =the mountains.= The Alps.

335. =wide long lake.= Lake Geneva is about forty-five miles long and
its greatest width is about nine miles.

336. =Rhone.= Where it enters Lake Geneva.

339. =town.= Vevay or Villeneuve, about six miles distant.

341. =a little isle.= Byron in a note speaks of this small island as
between the entrances of the Rhone and the Villeneuve.

354. =Methought.= See High School Grammar, page 272.

364. =too much oppressed.= By the brightness of the world outside at
which he had been looking.

368. =no hope my eyes to raise.= No hope, which would make me raise my
eyes.

369. =their dreary mote.= Their dulness. A mote is a particle of dust.

378. =a hermitage.= A hermit’s cave or cell; a retreat.

382. =sullen=. Gloomy.

390. =communion=. Association with our surroundings.

                 *        *        *        *        *


                ELEGY, WRITTEN IN A COUNTRY CHURCHYARD.

   First published in 1751.

   An Elegy is a poem or song expressing the writer’s feelings of sorrow
or mourning. The churchyard referred to in the poem is that of Stoke
Pogis in Buckinghamshire, where Gray’s mother lived during the latter
part of her life. Gray is buried in this churchyard.

9. =yonder ivy-mantled tower.= The tower of the village church at Stoke
Poges.

13. =that yew-tree’s shade.= It has been suggested that this should
read, “that yew-trees shade,” because the yew is not a large tree. In
that case the meaning would be “those rugged elms that shade the
yew-trees of the churchyard.”

16. =rude.= Lacking refinement, unpolished.

17. =incense-breathing.= Breathing fragrance.

26. =glebe.= Sod, turf.

29. =Ambition.= Ambitious people. Such personification is frequent
throughout the poem.

33. =The boast of heraldry.= The pride of lineage or family descent.
Heraldry was the science that dealt with armorial bearings; and a family
who were versed in heraldry and knew the meaning and history of their
coat-of-arms might be in a position to boast of their lineage.

38. =trophies.= Memorials to commemorate their great deeds.

39. =fretted vault.= The arched ceiling ornamented with fretwork.

41. =storied urn.= A vessel containing the ashes of the dead, and
inscribed with a record of his virtues.

=animated bust.= A life-like image.

43. =provoke.= Call forth.

41-44. What is the use of such trophies? they cannot bring the dead back
to life, and neither honour nor flattery can appeal to those who are
dead.

46. =pregnant with celestial fire.= Filled with the poetic spirit.

48. =the living lyre.= The musical instrument seeming almost as if it
had life.

51. Their poetic fervour (rage) was repressed by poverty.

52. =the genial current of their soul.= The flow of their finer feelings
and emotions.

58. =The little tyrant of his fields.= The landowner who attempted to
tyrannize over him.

60. =guiltless of his country’s blood.= The general opinion held of
Cromwell in the eighteenth century was that he was a cruel tyrant who
was “guilty of his country’s blood.” The village Cromwell is guiltless
because he has had no opportunity to act the part of a real Cromwell.

61. =senates.= Assemblies.

64. In the gratitude of the nation they saw the results of their own
efforts.

65-72. If their humble lot prevented the development of their best
qualities, it also limited their opportunity for doing wrong. It
prevented them from becoming tyrannical, from telling what is false,
from having to conceal their feelings of shame, and from accepting the
flattery which poets too often bestow upon their proud and wealthy
patrons.

70. =ingenuous.= Without artifice, frank, open-hearted.

73. This line is adjectival to the pronoun _they_ implied in _their_.

=madding.= Maddening, distracting.

76. =tenour.= Course.

78. =still.= Always, in all cases.

81. =unlettered.= Uneducated.

87. =the warm precincts of the cheerful day.= The warm bright earth.

=precincts.= Limits, boundaries.

88. =nor cast.= Without casting.

90. =pious drops.= Tears which are due to the dying (Lat. _pius_,
dutiful). It soothes the dying to know that some-one is weeping for
their loss.

91. Even the dead seem to cry out for remembrance.

93. =thee.= The poet is addressing himself.

94. =artless.= Simple, without deceit.

97. =Haply.= Perhaps. =Swain.= Country man, rustic.

105. =smiling.= Modifies _he_, l. 106.

108. =Or . . or.= Either . . or, a poetical form.

123. =Science.= Knowledge, in the wide sense of the word.

126-8. His merits and his weaknesses are both alike left in the hands of
God.

=dread abode.= Explained by the last line, which is in apposition.

=trembling.= With fear or anxiety.

                 *        *        *        *        *


                                MY KATE.

2-3. These women having nothing but their beauty to commend them are
forgotten in the long course of life.

=sunshine and snow.= With complexion rosy and white. Notice how this
metaphor is continued through lines 3 and 4.

12. Her face was so expressive that it conveyed almost as much as words.

18. =infer.= Judge, conclude.

23. =as.= And in the same way.

26. =in thrall.= Under her spell.

27. =that was all.= This was a great deal, but worldly people might not
think it much.

29. “And when she had passed it seemed like the ceasing of exquisite
music.”—_Evangeline._

31. =ribald.= Coarse in speech and action.

33. =see what you have!= See the result!

                 *        *        *        *        *


                               ROSABELLE.

   The ballad of _Rosabelle_ is taken from _The Lay of the Last
Minstrel_. It is sung at a wedding feast by the bard of the St. Clairs,
to whom belonged the castle of Roslin mentioned in the story.

1. The words of the bard in addressing the ladies at the wedding feast.

5. Note the directness with which the story begins. The reader is left
to supply his own details as to the speaker and the circumstances.

6. =ladye.= Lady, a poetical form.

7. =Ravensheuch.= Literally, Raven’s Crag. A strong castle now in ruins,
situated on the Firth of Forth. It was for a long time occupied by the
barons of Roslin.

8. =Firth.= The wide mouth of a river into which the tide enters.

10. =inch.= Island. =sea-mews.= Seagulls.

11. =Water-sprite.= Water-spirit.

18. =Roslin.= A castle and chapel on the Firth of Forth.

21. =the ring.= As a test of skill the knights, when riding at full
speed, attempted to carry off on the end of the lance a ring suspended
from a beam.

25. Roslin Chapel was said to appear on fire previous to the death of
one of the family of St. Clair.

31-2. Dryden and Hawthornden are places in the neighbourhood of Roslin.

36. =panoply.= A full suit of armour.

38. =Deep sacristy.= The vestry, said to be _deep_ because it extended
far back.

=altar’s pale.= The space enclosed by the altar railing.

39. =foliage-bound.= Carved with leaves and flowers.

41. =pinnet.= Pinnacle.

42. “Among the profuse carvings on the pillars and buttresses, the rose
is frequently introduced, in allusion to the name (Roslin), with which,
however, the flower has no connection.” (Scott.)

44. =St. Clair.= The St. Clairs were a noble family who ruled over the
earldom of Orkney and who held, besides, possessions in the Lowlands.

50. In allusion to the Roman Catholic burial service.

                 *        *        *        *        *


                               LOCHINVAR.

   This song is taken from _Marmion_.

20. He means to say that although he was once in love with the fair
Ellen, he is so no longer. Love comes very quickly but goes away just as
quickly.

=the Solway.= Solway Firth, an arm of the sea, on the south-west coast
of Scotland.

32. =galliard.= A lively dance.

39. =croupe.= The place on the horse’s back, behind the saddle.

41. =scaur.= A precipitous bank or rock.

42. =They’ll have fleet steeds that follow.= They that succeed in
following us will have to have fleet steeds.

                 *        *        *        *        *


                             TO A SKYLARK.

   Written and published in 1820.

   The skylark is a European bird, and is not found in America. It makes
its nest on the ground but rises high in the air, sometimes beyond the
point of vision, to sing. The Canadian Horned Lark, which is common in
our fields in early spring, sometimes also sings high in the air above
its nest.

12. =sunken sun.= The sun is still below the horizon.

15. =unbodied joy.= The lark is so high in the air that it no longer
appears to him as a bird; but hearing its song he thinks of it only as
an ethereal source of joy.

22-25. The rays of light from the morning star are so keen that even
when it has almost vanished in the light of the clear dawn we feel that
the star is there. So even after the bird has vanished from sight, we
know from the “arrows” of song that it is there.

36-7. He represents the poet as absorbed in his own bright fancies, and
in this way hidden from the rest of the world.

47. =a dell of dew.= A little dewy valley or hollow.

49. =aerial hue.= Literally, the colour of the air. The glowworm of
Britain is said to emit a bluish light.

55. =heavy-wingéd thieves.= The winds made heavy by the perfume.

56. =vernal.= Belonging to the Spring.

57. =twinkling.= Sparkling with the rain upon it.

61. =sprite.= Spirit.

66. =Chorus hymeneal.= A marriage song. Hymen was the God of marriage.

77. =Languor.= A feeling of weakness or exhaustion.

80. =sad satiety.= Just as one may become satiated with an excess of
sweet things, so the poet speaks of even Love, when enjoyed to the full,
as bringing with it a feeling of sadness.

82-5. Death is always bringing sorrow into our lives, so that under its
shadow we can never be quite happy. But perhaps the skylark knows more
about what Death really is, and sees that it is a good thing.

91-5. But even if we had no sadness of any kind in our lives, we could
not feel as keen a joy as the song of the skylark expresses.

103. =harmonious madness.= His rapture would find expression in an
ecstasy of song.

                 *        *        *        *        *


                                 ENID.

   First published in 1859. When the _Idylls of the King_ appeared in
their final form, in 1888, the story of _Enid_ was divided into two
parts, the first part being entitled _The Marriage of Geraint_, the
second, _Geraint and Enid_. The poem here given includes only the part
of _Enid_ which is now known as _The Marriage of Geraint_. Tennyson’s
story of _Enid_ is based upon the prose version of the story, as it
appears in the _Mabinogion_, a famous collection of Welsh fairy stories
and legends.

   Before beginning the study of the poem read the introductory note to
_Morte D’Arthur_.

24-5. The Queen, Guinevere, was the daughter of Leodogran, a tributary
king. When Leodogran had given his consent to the marriage of his
daughter Guinevere to Arthur, the king sent Lancelot, his truest and
bravest knight, to bring Guinevere to the court. Guinevere, not having
yet seen the king, fell in love with Lancelot, and her love was
returned. This secret love was continued, and under its influence,
little by little, the ideals of the knights were lowered. The incidents
in the story of _Enid_ are supposed to have taken place shortly after
the marriage of Arthur and Guinevere.

35. =caitiff.= Base, mean.

39. =common sewer.= This territory in which the bandits and caitiff
knights were gathered is compared to a public drain or sewer which
carries off the impurities of the city.

41. =marches.= Border country, frontiers.

45. =Severn.= A river of England and Wales, flowing south-west into
Bristol Channel.

48. =compass’d her with sweet observances.= Surrounded her with tokens
of his regard.

60. =uxoriousness.= Fondness for his wife.

78. If the current were less strong the water would break in striking
against the stone.

86. =all-puissant.= All powerful.

93. =liefer.= More gladly.

100. =high.= Bright.

145. =Whitsuntide.= A Church festival which falls on the seventh Sunday
after Easter.

146. =Caerleon upon Usk.= A town in Monmouth. The Usk is a tributary of
the Severn.

148. =Dean.= A tract of country west of the Severn.

172. =glancing.= Shining.

183. =break covert.= Come out into the open.

189. =vizor.= That part of the helmet which covers the face.

210. =abolish.= Destroy. Generally used of institutions, customs, etc.

213. =Wroth to be wroth.= Angry with himself for being angry.

217. =earths.= Holes in the earth.

220. =for pledge.= Which may be had if security is given for their
return.

223. =So that.= Provided that.

235. =at the vile occasion.= Because the cause of this delay was so
contemptible.

260. =The Sparrow-hawk.= A term of contempt. The sparrow-hawk is
despised as a bird of prey; but it was the emblem of the knight whom
Geraint was pursuing.

261. =an ancient churl.= An old peasant.

262. =sloping beam.= The slanting rays of the sun.

273. =sudden spleen.= A burst of anger.

274. =pips.= Diseases. A disease of fowls.

275. =Tits.= The titmouse, or tomtit, a small bird.

296. =frayed.= Worn by rubbing.

319. =wilding.= Wild; a poetical form.

325. =beneath.= Near the ground. =aloft.= Higher up on the wall.

337. When it first returns to Britain in the spring.

346. =Fortune and her wheel.= The wheel, which Fortune is represented as
turning, denotes instability. The substance of the song is that the
singer is indifferent to Fortune and will be content whatever she may
bring.

354. Even if fortune seems against us, yet we will smile, for we are
still able to use our hands to work.

363. =dim brocade.= Faded silk, woven with gold and silver thread or
with ornamental designs.

364. =vermeil-white.= Reddish-white.

368. =rood.= Cross.

386. =costrel.= A wooden or earthenware bottle.

389. =manchet.= Fine white bread.

396. =trencher.= A large wooden plate.

432. =Camelot.= See _Morte D’Arthur_ line 21, and note.

438. =who see but acts of wrong.= The Earl means to say that in this
little village they saw no good deeds. They themselves had suffered from
wrong-doing.

491. =toppling over all antagonism.= Overcoming all opponents.

496. =lay lance in rest.= See _Morte D’Arthur_, line 222, and note.

502. =when at mine uttermost.= In direst need.

513. =prove her heart.= Test her feelings.

519. =kept her off.= Held her at arm’s length so that she could see
Enid’s face.

535. =To quicken to the sun.= To become alive under the influence of the
sun.

537. =jousts.= See _Morte D’Arthur_, line 102, and note.

542. =beyond the rest.= More strongly than the rest.

543. =The chair of Idris.= Cader Idris, the highest mountain in Wales.

547. =lists.= The enclosed ground where tournaments were held.

559. =Yule.= Christmas.

566. =as of phantom hands.= The sound of the echo.

568. =The dew of their great labour.= Their perspiration.

595-6. See introductory note to _Morte D’Arthur_.

641. =sold and sold.= Sold one after another.

661. =turkis.= Turquoise. A garnet is red; a turquoise, blue.

663. =tissue.= Woven cloth.

672. =mixen.= Dunghill.

710. =seneschal.= Chief steward, who superintends the feasts and
ceremonies.

724. =ragged-robin.= A British wild flower.

730-1. =Esther.= ii., 2-17.

743. =Gwydion.= In one of the legends of Welsh mythology, Gwydion, the
nephew of the king, helps his uncle, Math, to create a beautiful maiden
by magic (glamour) out of flowers in order to provide a wife for the
young prince Llew.

744-5. =the Bride of Cassivelaun, Flur.= Cassivelaun was king of Britain
at the time of Cæsar’s second invasion (54 B.C.). The poem suggests that
Cæsar was in love with Flur, the betrothed bride of Cassivelaun.

764. =flaws.= A flaw is a sudden burst of wind.

774. =careful robins.= Watching to see whether there are worms for food
in the ground that is delved.

797-804. Geraint suspected that Enid had allowed herself to be
influenced by her mother’s wishes, or that she had been carried away by
his brightness in contrast with the dimness of her own surroundings.

810-1. Dearer because she was resuming a splendour to which she had
formerly been accustomed, but which she had been forced to give up for a
time.

838. =Dubric.= The Archbishop.

                 *        *        *        *        *


              ODE ON THE DEATH OF THE DUKE OF WELLINGTON.

   Published on the morning of November 18th, 1852, the day of the
funeral of the Duke of Wellington.

9. The Duke is buried in St. Paul’s cathedral, which stands in the
busiest part of London.

23. =state-oracle.= The wise adviser of the nation.

36. The Duke’s words were taken as an indication of the probable course
of events in the future.

42. =World-victor’s victor.= Victor over Napoleon, who was the World
victor.

49. =cross of gold.= St. Paul’s cathedral is surmounted by a golden
cross.

56. =its blazon’d deeds.= The record of his victories engraved on the
funeral car.

75-9. He calls upon the poets who celebrate the virtues of the British
people to continue to give due honour to the Duke. In lines 77-9 the
figure is that of broad avenues leading up to a great hall or castle.

=civic muse.= The muse (spirit of poetry) presiding over public affairs.

80-2. Nelson is also buried in St. Paul’s. In these lines he is
represented as speaking.

99. =Assaye.= A village in Hindostan. Here in 1803 Wellington (then
Arthur Wellesley) with only 5,000 men defeated an army of over 30,000
Mahrattas.

104-5. Referring to the lines of Torres Vedras, which were constructed
by Wellington as defences in the Peninsular war, during the years
1810-11.

112. After the battle of Vittoria in 1813, the French armies crossed the
Pyrenees and withdrew from Spain.

=her eagles.= Napoleon took the eagle as his standard.

119. Refers to the renewal of the war after the escape of Napoleon from
Elba.

=ravening.= Rapacious, devouring ravenously.

123. =that loud Sabbath.= The battle of Waterloo was fought on Sunday,
June 18, 1815.

129. The sun is said to have shone through the breaking clouds just as
the Allies made their final charge against the French.

136. =silver-coasted.= Referring to the white chalk cliffs of southern
England.

137. =the Baltic and the Nile.= The battle of the Baltic was fought at
Copenhagen in 1801. The battle of the Nile was fought in Aboukir Bay in
1798.

145. The real proof of a man’s fame is seen in the fact that a nation
continues to honour him and echo his praises from century to century.

152. During the few years preceding the publication of this poem,
revolutions had taken place in several countries of Europe.

155. =Saxon.= Changed to “Briton” in a later edition.

160-1. =the eye, the soul of Europe.= He speaks of England as the
country that not only sees what is best but is most anxious for true
progress.

162. =the one true seed of freedom.= British freedom representing the
only true freedom of Europe.

168. Note the figure of speech.

170. =wink.= Close the eyes.

179-80. He never did wrong for the sake of some immediate advantage, nor
trifled with what is right, for the sake of gaining power.

182. People of either high or low rank who were given to talking idly.

184. =hewn from life.= Growing out of his experience.

188. =our England’s Alfred.= King Alfred the Great.

196. =stars.= Marks of distinction.

197. The Goddess of Fortune is represented as carrying a cornucopia
(horn of plenty).

202. =was.= “Turned out to be.”

206-8. He shall find that in facing hard and disagreeable duties his
reward will be greater than that which comes from a life of selfish
ease.

215-8. He shall find that though the performance of difficult tasks
sometimes threatens to overwhelm him, yet in the end it will bring with
it the peace and happiness of a character which has the approbation of
God himself.

In line 215 the conjunction _that_ is omitted.

236. =For one.= On account of the death of one.

242. =More than is of man’s degree.= Spiritual presences.

250. =fane.= Temple.

252-3. Note the metaphor. The poet suggests that music appeals to our
higher nature,—to what is spiritual and hence eternal in man.

259. =Giant Ages.= In Greek mythology the Giants were a race of fabulous
monsters who made war on Zeus. They were subdued, and great mountains
were piled on top of them, beneath which they still struggle. Tennyson
here personifies the long ages of time as giants shaking the hills and
breaking the shore.

274. =Being here.= While he was here.

275. =Something.= An adverb, as here used.

                 *        *        *        *        *


                             THE DAY DREAM.

   In _The Day Dream_ Tennyson has elaborated in poetical form a series
of scenes from the well-known fairy tale of _The Sleeping Beauty_ or
_Briar Rose_. In the fairy story, Briar Rose is a beautiful princess who
was fated to fall asleep in her fifteenth year and remain sleeping for a
hundred years. When the princess is overtaken by her long sleep,
everything in the castle falls under the same spell. An impenetrable
hedge of briars grows up about the castle grounds, and all who strive to
force an entrance perish in the attempt. At length, when the hundred
years have passed, comes a splendid prince, who hears from an old man
the story of the mysterious castle and the sleeping princess. When he
reaches the hedge he passes easily through, for the briars have turned
to flowers. At the very moment when he finds the princess, the hundred
years are completed, and as he kisses her she opens her eyes once more.
When the princess wakes, the whole castle revives, and life goes on
again as it did a hundred years before. The story ends with the marriage
of Briar Rose and the prince.

   The fairy tale in its original form was probably suggested by the
changing seasons. In Winter the earth, the fairy princess, begins her
long sleep. In the Springtime comes the sun, the fairy prince, and at
the touch of his kiss the earth awakes to new life and beauty.

   From the poem as here given, _The Prologue_, _L’Envoi_ and _The
Epilogue_ are omitted. In _The Prologue_ the poet tells his companion,
Lady Flora, that the sight of her beauty as she lay asleep had called to
his mind an image of The Sleeping Beauty, and that in his “day dream” he
had recalled the old legend. And so as she works at her embroidery he
bids her listen to the story. _L’Envoi_ and _The Epilogue_, written also
in a light and fanciful vein, contain the poet’s comments on the story.

1. =blade and sheaf.= Spring and Autumn, seed time and harvest.

3. =Here.= In the Sleeping Palace, in contrast with the outside world.

9. =range.= Rows.

10. =terrace-lawn.= The sloping lawn built up in the form of terraces.

11-2. The fountain is not flowing, but the water has withdrawn, or drawn
back, to the garden lake from which it used to flow.

13. =droops.= The predicate also for the _fires_, _peacock_ and
_parrot_.

15. =laurel bower.= His retreat among the laurel bushes (evergreens).

16. =wires.= Cage.

18. =these, those.= Both the eggs and the birds.

22-3. The real things in and around the Sleeping Palace seem more like a
picture than even the portraits on the walls.

34. =Oriel.= An ornamental projecting window.

40. Judging from his appearance and his surroundings.

43. =woodbine.= Any climbing plant such as clematis or honeysuckle,
which binds, or twines around, the wood.

50. For these sleeping people.

51-2. When they wake to think once more, they will learn new things and
will see things in a truer light and will be moved to act accordingly.

                          THE SLEEPING BEAUTY.

61. =tranced.= See _Enoch Arden_, line 793, and note.

71-2. Her beauty never changes, and the silent chamber seems to be
filled with love, and the day seems to be brighter because of her
beauty.

76. =charmed.= Under a spell.

                              THE ARRIVAL.

81-4. It seems as if when precious things have remained long hidden,
they come forth of their own accord to greet those who seek them; for
when Fate has decreed that some hidden work shall be revealed, Love
follows up the decree and makes the discovery.

=in sequel.= Following.

86. =on the rocks.= Against the dull rocks.

90. =to pass.= To penetrate the hedge.

91. =close.= Enclosure, applied here to the hedge.

92. =blanching.= Whitening.

101-4. During all his past life a magic voice seemed to whisper to him
that he would be fortunate.

106-7. =The Magic Music.= The sound of his heartbeats is spoken of as
music which helped to tell him, as if by magic, that he was near the
sleeping princess.

                              THE REVIVAL.

129. =these.= These noises.

137. =Pardy.= Fr. _par-dieu_, a form of oath.

144. =put the question by.= Did not reply to the king’s question. He had
forgotten what the bill was about.

                             THE DEPARTURE.

148. The world of love which was new to them but which was old to
others.

156. =this and this.= He kisses her again.

157. =sliding.= Softly moving.

159. The light of dawn streamed through the openings in the clouds.
_Stream’d_ is a participle modifying _twilight_.

165-6. Evening is approaching. The lines of flowing clouds, rosy in the
light of sunset, are compared to waves upon which the crescent moon is
floating like a boat upon the sea.

167. =rapt.= Carried along, moved forward.

                                 MORAL.

177-84. A thing that is beautiful in itself, as this story is, needs no
moral. “Beauty is its own excuse for being.”

185-92. In all things in Nature we can find a meaning if we choose. So
with this story, as with other forms of art, it is possible to read into
it different meanings.

                 *        *        *        *        *


                   YOU ASK ME, WHY, THO’ ILL AT EASE.

2-4. England, whose misty climate depresses the spirits and makes men
long for the warmth and colour of the South.

6. =sober-suited.= Not showy.

10. =of just and old renown.= England has long been renowned for her
free institutions, and justly so.

11-2. British freedom has been gained gradually, each new step growing
out of events that have gone before. The Magna Charta, for example, was
a precedent for the Petition of Right.

13. Those who seek to create dissension seldom succeed in bringing about
an actual struggle.

15. A diffusive thought is one which readily spreads or circulates from
mind to mind.

16. =Hath time and space.= Because Great Britain in itself is a small
country.

17-26. If the time should ever come when any body of men should band
themselves together to persecute those who do not agree with them, and
when a man may not “speak the thing he will,” then, no matter how
powerful or wealthy Britain may become, I will leave this country.

23-4. Note the metaphor in these two lines. Though the country should be
overflowing with wealth from all its various sources—its mines, its
fisheries, etc.

28. Read line 4.

                 *        *        *        *        *


                             THE TRAVELLER.

   Published in 1764.

   Goldsmith dedicated _The Traveller_ to his brother Henry, who was a
country curate in Lissoy, a village in Ireland. The substance of the
poem is briefly summed up by Macaulay as follows:—

       “No philosophical poem, ancient or modern, has a plan so
    noble and at the same time so simple. An English wanderer,
    seated on a crag among the Alps, near the point where three
    great countries meet, looks down on the boundless prospect,
    reviews his long pilgrimage, recalls the variety of scenery, of
    climate, of government, of religion, of national character,
    which he has observed, and comes to the conclusion, just or
    unjust, that our happiness depends little on political
    institutions, and much on the temper and regulation of the
    mind.”

1. =Remote=, etc. These adjectives modify _I_ in line 7.

=slow.= Wandering slowly because heavy of heart.

2. =Scheldt.= A river flowing into the North Sea. =lazy.= Having a slow
current.

=Po.= A river in northern Italy. =wandering.= Winding.

3. =Carinthian.= Carinthia is a province of Austria.

4. =Campania.= The Campagna—a plain adjacent to the city of Rome.

8. =My heart untravell’d.= His affections are still with his early home.

11. =crown.= Subjunctive mood, expressing a wish.

=friend.= His brother.

15. =where want and pain repair.= (Personification.) To which the needy
and the troubled go (repair) for help.

23. =me.= Object of _leads_.

27-8. These two lines explain how the fleeting good mocks him. His idea
of what will bring him happiness is always changing. When one thing is
attained he finds no real satisfaction in it, but is constantly looking
forward to some new thing which he thinks may bring him happiness.

32. =pensive.= Meditative.

34. =a hundred realms.= Exaggeration for effect.

38. Should the proud man remain ungrateful and dissatisfied?

39-40. Should the scholar, puffed up with his knowledge, look with scorn
on the petty pleasures of these humble people?

41-2. The scholar may try to pretend that he takes no pleasure in these
things, but man is petty and enjoys these petty pleasures.

48. =dress.= Cultivate.

50. =Creation’s heir.= In apposition with the pronoun value of _mine_.

51-8. Note the points of comparison involved in the simile. What are the
alternate possessions of the miser? Of the poet?

64. =pretend.= Claim.

69. =the line.= The Equator.

70. =palmy.= Made from palms.

71. =tepid.= Lukewarm.

75-80. This idea is elaborated and illustrated in the remainder of the
poem.

82. No matter where one lives, Nature gives returns to those who labour.

84. =Idra.= Probably Lake Idro in Switzerland.

=Arno.= A river in Italy.

90. =either.= Here means any one of the things mentioned.

93. =prone.= Disposed, inclined, favourable to.

98. =peculiar pain.= Pain which follows this particular good.

101. =proper.= Own, belonging to me.

108. =Woods over woods.= Like tiers of seats in theatres.

114. Growing on trees or on trailing vines.

117-8. The flowers of northern countries, which last only through the
spring.

119. =kindred.= The soil is said to be _kindred_ because it produces all
these varieties naturally as if this was their common home.

121. =gelid.= Cool, refreshing.

122. =winnow fragrance.= Carry perfume.

123. =sense.= The senses.

125. =florid.= Bright with flowers.

127. =manners.= Actions, habits of living.

129. =zealous.= Full of religious zeal.

133-8. Referring to the commercial prosperity of Italian cities during
the fifteenth century.

136. =long-fallen.= Since the days of ancient Rome.

138. The quarry was filled with marble from which statues of human forms
were chiselled.

142. =unmann’d.= Without men.

143-4. Certain diseases were supposed to arise from a superabundance
(plethora) of blood. So ills arose out of the prosperity of Italy.

=with fruitless skill.= All the skill mentioned in lines 134-8 brought
no real results. It could not save Italy.

149-50. The modern processions are bloodless, that is, they do not
celebrate real victories. The chariots are made of pasteboard for mere
show.

151. =piety and love.= Religious processions, which were often made the
means of furthering love intrigues.

157. =succeeding.= Following.

158. =happier meanness.= The people, because of their degraded
condition, are happier in the enjoyment of these mean pleasures than
they would be in pursuit of nobler aims.

160. Bring out the points of comparison in the simile.

167. =bleak.= Cheerless. =mansion.= Here, country.

168. =churlish.= Generally applied to people in the sense of rude in
manner. Here, stubborn, unwilling to yield a harvest.

171. =torpid.= Sleepy, lifeless.

174. =invest.= Take possession.

176. =Redress.= Compensate for.

187. =patient angle.= An example of Transferred Epithet.

198. =nightly.= For the night; not “night after night.”

199. Supply _that_ or _which_.

203. =conforms.= The rudeness and smallness of his home, a mere shed, is
in keeping with his mind which is lacking in finer qualities.

214. =redrest.= Satisfied, provided for.

215. =science.= Branch of learning.

216. =excites desire.= Awakens the desire for the pleasure to be derived
from the study, and then supplies that pleasure.

217-8. Line 218 tells what is _unknown to them_. When they are satiated
with sensual pleasures they do not know how to seek the _higher
pleasures of the mind_.

219. =those powers.= Music, poetry, painting, etc.

230-1. Love and friendship belong to the finer feelings, but they find
no place in the heart of the mountaineer.

=indurated.= Hardened, unfeeling.

234. =Cower.= Generally means to shrink with fear. Here it simply means
to sit, to bend low.

242. =whom all the world can please.= They are easily pleased with the
attentions and the flattery of others.

244. =tuneless.= Because he lacked the skill to play.

253. =gestic lore.= The knowledge of dancing.

258. =honour.= Note that the word _honour_ is used here in the sense of
adulation or praise.

264. =an avarice of praise.= They are greedy for flattery.

265. =they give to get esteem.= They flatter others in order that others
may flatter them in return.

266. Flatterers credit them with qualities which should make them blest,
and being credited with these qualities they naturally try to live up to
them.

267. =this softer art.= Flattery or adulation.

271. =within itself unblest.= finding no happiness in its own thoughts.

273. They attempt to win praise by an external show of shabby finery.

276. =frieze.= A kind of coarse woollen cloth.

=copper lace.= Gold lace was commonly used in eighteenth century
fashions. Copper lace would be a poor imitation.

277. People who were poor but proud lived sparingly from day to day in
order to have one feast in the year to make a show of wealth before the
world.

279-80. They continue to follow the changing fashions and do not stop to
consider how much better it would be to have the approval of their own
better selves.

282. Holland is in parts below the level of the sea, and hence
‘embosomed in the deep.’

284. =leans against the land.= Presses against the dykes or embankments.

285. =sedulous.= Industrious, diligent. Both the adjective _sedulous_
and the verb _lift_ relate to _sons_ l. 283.

286. =rampire.= Rampart; here, the bank or dyke which has been made by
man (hence ‘artificial’) and which rises proudly above the sea.

291. =pent.= Confined, limited, shut out.

=rising o’er the pile.= Rising up along the sides of the dyke.

292. =amphibious.= Generally applied to animals which are able to live
both on land and in water. Holland is said to be _amphibious_ because it
naturally belongs to the sea but has been reclaimed as part of the land.

297. =wave-subjected soil.= This soil in its natural condition is under
control of the sea.

305-6. These lines probably refer to the political struggles and
intrigues which long disturbed the Netherlands.

313. =Belgic sires.= The tribes known as the Belgae who inhabited the
Netherlands in the time of Caesar.

317. =the sound.= The sound of the name ‘Britain.’

=genius.= The poetic muse.

318. Britain receives the warm winds from the west, and Spring is
earlier here than in other European countries.

319. =lawns.= Stretches of meadow land.

=Arcadian.= Arcadia was a division of Greece. Because of the simple
pastoral life of its people the name Arcadia came to stand in poetry for
any imaginary country of ideal beauty and simplicity.

320. =Hydaspes.= A river of India (now called Jelum) flowing into the
Indus. It was the eastern boundary of the kingdom of Alexander the
Great.

323-4. Extremes are not found in the climate, but only in the minds of
the people.

325. They are controlled by reason; but their aims are daring, and hence
great in an unusual way. The aims of men in other countries may be
great, but they follow the regular lines of thought and there is nothing
daring or irregular about them.

330. =By forms unfashion’d.= They do not follow fixed or conventional
lines of conduct. They are not artificial, but natural, in conduct.

331. =native hardiness.= Natural vigour.

332. They are true to what they conceive, or imagine, to be right, and
they cannot be held in check.

333. Even the humblest peasant boasts that he examines these rights.

337. Such blessings would be too great if they were unmixed with some
evils.

=alloy.= The base metal which is sometimes mixed with precious metals.

342. The nominative absolute construction.

343. The natural ties uniting members of the family or the community are
not strong.

345. =imprison’d.= Held in control by the law.

346. =round her shore.= Throughout the country.

347-8. Note the metaphor in these lines.

   The idea is that when the wheels of a carriage are subjected to too
great friction they either refuse to turn, or else catch fire from the
over-heating of the axle. So in society, this internal struggle and
ferment (ll. 344-6) must result in a breakdown in the machinery of
government or in political disturbances. _The Traveller_ was written
about the time of the Wilkes’ agitations in Britain.

351. =Fictitious.= Artificial.

357. =noble stems.= The heads of noble families.

359. =sink.= A drain to carry off impure water. By speaking of England
as a _sink_ he suggests that her ideals have become base and impure.

=level avarice.= Greed for money among all classes of people.

369. =the changeful clime.= Of Britain.

370. Just as plants are pruned to make them better and stronger, so if
the freedom of the British people is repressed when it tends to go to
extremes, it will bring greater security.

373-6. He means to say that if any class of people is to be allowed too
great privileges it will affect the rights of others.

381-8. The lines are subordinate, grammatically, to line 389.

381-2. These and the following lines express Goldsmith’s opinion of the
Whig government then in power.

383. =a factious band.= A group of politicians seeking to further their
personal interests by agitation and dissension.

385. There was nothing to restrain the judge from drawing up new laws
for punishment of offences (penal statutes).

=wanton.= Without restraint.

387-8. He means to say that money was extorted from people in the
colonies, such as India, to corrupt the electors in Great Britain.

=to purchase slaves.= To bribe the voters, to make them subservient.

391-2. Partly from motives of patriotism, partly from fear of the evils
threatening my country, I appeal to the sovereign to protect it against
these petty political tyrants.

393. =baleful.= Evil, pernicious.

395. The sovereign is here regarded as the fountain-head or source of
honour.

396. =Gave wealth to sway.= Gave wealth the power to sway.

398. The wealth (useless ore) of the landowners was used to buy up the
small holdings, and the labourers (useful sons) were turned adrift and
forced to emigrate.

399. Britain’s successes in war have only helped to hasten destruction
by bringing into existence a wealthy class of men.

401-2. See note on line 398 above.

403-4. The rich man lives at his ease on estates where villages once
stood.

407. =decayed.= Worn out, on the decline.

411. =Oswego.= A river in the State of New York, flowing into Lake Erie.

412. =Niagara.= Note the pronunciation.

417. =giddy.= Whirling.

418. =distressful.= Causing distress.

421. Looks towards England.

422. The feelings of the exile are the same as those of the poet.

423-38. Lines 361-422 have been in the nature of a digression, and the
poet now returns to his original subject as presented in the first
hundred lines of the poem. He has come to the conclusion that happiness
does not depend upon external conditions, but upon the individual
himself; and this conclusion is summed up in lines 431-2.

425. Why have I tried to find the source of happiness in the government
rather than in the mind, which is the centre of pleasure and repose?

431. _Consigned_ modifies _felicity_. We are entrusted with the making
of our own happiness.

433-4. The joy which any man feels in his life from day to day comes
from his own innermost feelings, and external events cannot disturb it.

435-8. Even though a man be put to torture, it cannot rob him of the
truest sources of happiness in his life—reason, faith and conscience.

434. =The lifted axe.= The executioner’s axe.

=the agonizing wheel.= An instrument of torture causing extreme agony.
The victim was fastened to a wheel or a cross, and his legs were broken
with an iron bar.

436. =Luke’s iron crown.= In 1513 two brothers, George and Luke Dosa,
were taken prisoners in a rebellion. George (not Luke) Dosa was put to
death by having a red hot crown placed on his head, in mockery of his
desire to become king.

=Damiens’ bed of steel.= In 1757 Damiens, an insane fanatic, attempted
to kill Louis XV, King of France. He was bound upon an iron bed and
subjected to terrible tortures.

437. These tortures are rarely known to men who are not engaged in
public affairs.

                 *        *        *        *        *


                      HOME-THOUGHTS, FROM THE SEA.

   Written on the occasion of a voyage from England to Italy in 1838. As
the vessel passes the south-west coast of Portugal and Spain, Cape St.
Vincent, Cadiz and Trafalgar are seen in turn, and as darkness is coming
on, Gibraltar rises dimly in the distance. The poem expresses Browning’s
feelings as he calls to memory the great victories of England that are
connected with these historic scenes.

1. =Cape St. Vincent.= A cape at the south-east extremity of Portugal.
In 1709 Admiral Jervis with a British fleet of fifteen vessels, defeated
a Spanish fleet of twenty-seven vessels.

2. =reeking.= We often speak of blood as reeking, that is, steaming
(_Ger. rauchen_, to smoke). So here the sunset is spoken of also as
reeking because it is red like blood.

=Cadiz Bay.= Off the south-west coast of Spain. Cadiz was sacked by the
English fleet under Essex in 1596.

3. =Bluish.= The land was bluish when seen in the distance.

=full in face.= Directly ahead of the vessel.

=Trafalgar.= Cape Trafalgar, on the south-west coast of Spain. At
Trafalgar in 1805 Nelson defeated the combined fleets of France and
Spain.

4. =dimmest north-east distance.= After the vessel passed Trafalgar and
turned to enter the straits, the rock of Gibraltar was seen dimly to the
north-east. Consult a good map or atlas.

=dawned.= Appeared dimly on the horizon.

=Gibraltar.= The fortress of Gibraltar came into the hands of the
English in 1704. It was, later in the century, successfully defended
against a number of attacks.

5. =Here and here.= In the battles he has mentioned.

=say.= The subject of _say_ is the noun clause following.

5-6. Anyone who turns as I do to praise God for England’s victories and
to pray for her continued greatness, cannot but ask himself the
question, “How can I help England in return for what she has done for
me?”

7. =Jove’s planet.= The planet Jupiter. Perhaps the sight of “Jove’s
planet” suggests to the poet England’s continued strength and glory.

=over Africa.= To the south-east. Possibly the vessel has not yet passed
Gibraltar which he had only seen dimly in the distance as night came on.

                 *        *        *        *        *


                              THE PATRIOT.

   _The Patriot_ tells the story of a man who has come into power amid
the acclamations of the crowd as the hero of the people. But popular
favour is fickle, and in one short year he is reviled and led to
execution. He suffers, not because he has failed in his duty, but simply
because he has failed to please the fickle crowd. To those who have read
history the sub-title AN OLD STORY will need no further explanation.

2. =myrtle.= The leaves of the myrtle were used to make wreaths for
those who won triumphs in the arts of peace. It is an emblem of peace
and joy.

6. =a mist.= Of course this is not to be taken literally. It is a poetic
way of saying that the air is filled with the sound of bells.

8-10. If I had objected that I did not like noise but that I wished them
to give me the sun from out the sky they would have been quite willing
to give me not only the sun but anything else they had.

17. =a palsied few.= Too feeble to follow the crowd.

20. =Shambles’ Gate.= A fictitious name for the place of execution.
Shambles are the places where animals are slaughtered or where butchers’
meat is sold. Hence, as here, a place of butchery.

25. =my year’s misdeeds.= What the rabble consider as misdeeds.

27. The man who has been honoured by the world, even if he drops dead in
the midst of his triumph, has been paid, and perhaps more than paid, for
his good deeds, and if men’s rewards and punishments are balanced up, in
the next world, such a man may find that he is in God’s debt. But the
speaker, “The Patriot,” is suffering so much injustice and wrong that he
is sure that some balance of reward will be due him in the next world.

                 *        *        *        *        *


                         LOVE AMONG THE RUINS.

1. =The quiet-coloured end of evening.= The late twilight when the
bright colours have faded from the sky.

7. =a city.= The poet had in mind probably the Campagna,—the level
stretch of country outside the city of Rome. This district was once very
thickly populated.

9. Supply the conjunctive pronoun, _that_ or _which_.

13. Notice that throughout the poem, the description of the scenery as
it now appears, is alternated with the pictures of its former splendour.

15-8. If there had been trees it would have been an easy matter to
distinguish certain slopes from others by the single trees or groups of
trees growing on them. Now these slopes are separated only by streams
and they take their names from the names of these streams which flow
through the valleys.

19. =daring.= Because it rose so high.

20. =like fires.= Glittering in the sunlight.

23. =nor be pressed.= Without being crowded.

29-30. =guessed alone, stock or stone.= You can only guess that the
sticks and stones are there; the grass covers them.

39. =caper.= A low prickly shrub.

=gourd.= A trailing or climbing plant, such for example, as our wild
cucumber. =overscored.= By the stems of the vines, which form lines on
the wall.

41-2. =houseleek.= A plant commonly found on old walls and ruins.
patching. covering up the holes; or, perhaps, forming patches on the
walls. =winks.= When moved by the breeze.

45. =burning.= Because they were made of gold.

47. =minions.= Favourites.

50-2. Smiles because she is leaving the flocks to return in peace to
their folds.

55. =yellow hair.= A suggestion that she belonged to a northern race.

57. =caught soul.= They were inspired to do their best by seeing the
king and courtiers watching from the tower.

63-4. =the glades’ colonnades.= The rows of columns in the valleys.

65. =causeys.= Causeways. A causeway is a raised road passing over wet
or marshy ground.

79. He appeals to the feelings of his readers, who are moved by the same
passions now as in the past.

80-4. These ruins are Earth’s returns, the only result of centuries of
folly, noise and sin. In contrast with this is Love, which endures.

                 *        *        *        *        *


                          THE ISLES OF GREECE.

   This poem appears in Byron’s _Don Juan_. It is supposed to be sung by
a wandering Greek minstrel during the marriage feast of the hero and
heroine of the story; but it is a direct expression of Byron’s own
feelings on the subject of Greek freedom.

2. =Sappho.= A lyric poetess who was born on the island of Lesbos about
625 B.C.

=burning.= In reference to the passion in her poems and songs.

4. According to myth, Leda, who had supplanted Juno in the affections of
Jupiter, was forced to flee from heaven to escape the wrath of Juno.
Neptune took pity on her and raised the Island of Delos out of the sea
in order to afford her a shelter. Here Phoebus and Diana, the twin
children of Jupiter and Leda, were born.

7. =The Scian and the Teian muse.= The island of Chios (Scio) was said
to be the birthplace of Homer, and the town of Teos, in Asia Minor, was
the birthplace of the poet Anacreon.

11. =farther west.= In America.

12. In Greek mythology the “Islands of the Blest” were situated
somewhere far in the western ocean.

13. Mount Pentelicus and Mount Parnes overlook the plain of Marathon,
where in 490 B.C. a great battle was fought between the Persians under
Darius, and the Greeks, led by Miltiades.

21. Ten years after the battle of Marathon, Xerxes, the son of Darius,
invaded Greece with a vast army. The Persian fleet was defeated at
Salamis, by the Greeks under Themistocles. Xerxes watched the progress
of the fight from the mainland.

31. =in the dearth of fame.= Though the Greeks are no longer famed for
their poets.

32. =a fetter’d race.= Since 1715 Greece had been in the hands of the
Turks. The War of Independence which began in 1821, resulted in the
establishment of the Greek kingdom in 1832.

37-8. =we.= Italicized to bring out the contrast with _fathers_.

40-2. A reference to the battle of Thermopylae (470, B.C.) in which
Leonidas with 300 Spartans and several hundred auxiliaries held the
whole Persian army in check.

43. He has called upon the dead heroes of Greece to return (ll. 39-42);
and now he listens for a reply.

49. =In vain.= It is in vain that we look for even one living hero to
arise to lead the Greeks.

50-2. Samos, Chios, and other islands were famous for their wines.

53-4. =Bacchanal.= A follower of Bacchus, the god of wine.

55-6. The Pyrrhic dance was so named from Pyrrhichus, who invented it.
The Pyrrhic phalanx derives its name from Pyrrhus, king of Epirus. A
phalanx is a serried formation of troops.

59. The alphabet is said to have been introduced into Greece by Cadmus,
a Phœnician, who lived about 1450, B.C.

63-5. Polycrates, who ruled over the Island of Samos, was the patron of
Anacreon. _Tyrant_ in the Greek sense meant simply “ruler” or “master,”
and as here used the word does not imply harshness or cruelty.

68. =Chersonese.= The word literally means a peninsula. Here it refers
to the Tauric Chersonnesus, the modern Crimea.

72. That is, he bound the Greeks together to resist their enemies.

74. =Suli.= A mountainous district inhabited by a mixed Greek and
Albanian people.

=Parga.= A fortified town on the coast of Albania.

76. =Doric mothers.= Spartan mothers. The Spartans belonged to the
Dorian race.

78. =Heracleidan blood.= The descendants of Heracles (Hercules).

=might own.= Might not be ashamed of. Supply _that_ or _which_ at the
beginning of the line.

79. =the Franks.= The French.

80. Louis XVIII was at this time king of France. Perhaps Byron is
referring to Napoleon, who entered into alliance with the Turks.

89. =mine own.= Mine own eyes.

91. =Sunium.= The southern promontory of Attica.

=marbled steep.= The temple of Athena stood on this promontory.

94. =swan-like.= See Morte D’Arthur, line 267, and note.

                 *        *        *        *        *


                       AS SHIPS, BECALMED AT EVE.

1. =As.= The word _so_ in line 9 is correlative with _as_, introducing
the other member in the comparison.

=ships.= Subject of _are descried_.

3. =towers of sail.= Filled with the breeze, which has sprung up in the
night. This line forms a predicate completion of _are descried_ (line
4).

6. =darkling.= Dark, a poetical form.

7. =but.= Except, that—not. Did not dream but that, each, etc.

9. =E’en so.= Just in the same way differences in opinion arise between
friends.

13. Unknown to each other, both came under different influences that
changed the course of their opinions and beliefs.

16. =dawn.= When their beliefs were made known.

17. =To veer, how vain.= When people have drifted apart in their points
of view it is vain for them to try to change their course to come
together again.

19. =one compass.= Conscience.

22. =parting.= Nominative absolute.

25-6. Both were searching for truth.

27-8. Clough hopes that wherever the course of events may carry the
human race, sometime, somewhere, all differences in thought may be
reconciled.

                 *        *        *        *        *


                        THE CHAMBERED NAUTILUS.

1-7. The nautilus is a species of shell-fish. The shell is spiral, and
is divided into chambers or cavities. The animal occupies only the outer
cavity. The others are filled with gas. The belief once existed that the
nautilus was furnished with a membrane which served as a sail. The root
meaning of the word _nautilus_ is “a ship.” This old belief is, however,
only a poetic fancy. The nautilus creeps along the bottom of the sea,
and does not come to the surface to swim or sail.

5. =the Siren.= The Sirens were sea-nymphs, who by their entrancing
music fascinated those who sailed along their shores, and drew them on
to their destruction.

13. The shell is broken so that the separate cells are seen.

14. =irised ceiling.= The walls of the cell, tinted like the rainbow.

=crypt.= A crypt is an underground vault used for burial purposes. Here
the enclosed chamber in the shell of the nautilus.

20. =idle.= Unused.

24. =forlorn.= Forsaken, solitary.

26. =Triton.= The son of Neptune, the god of the sea. He is generally
represented as blowing upon a trumpet formed from a sea-shell, to quiet
the restless waves.

=wreathéd.= Referring to the convolutions of the shell which was used
for a horn.

28. =caves of thought.= A poetical way of speaking of his innermost
self.

31. =low-vaulted.= Limited, confined, like a chamber with a low ceiling.

33. Let your growth be such from year to year that your spiritual
outlook is larger.

35. =thine out-grown shell.= The body in which the soul dwells.

                 *        *        *        *        *

=Transcriber’s Notes:=

Archaic spellings and hyphenation have been retained. Punctuation has
been corrected without note. Other errors have been corrected as noted
below.

Page 52, Some mute inglorions Milton ==> Some mute inglorious Milton
Page 112, Whese rougher climes ==> Where rougher climes
Page 117, love, and honor fail ==> love, and honour fail
Page 132, Home Thoughts, from the Sea ==> Home-Thoughts, from the Sea
Page 135, Many imaegs went to ==> Many images went to
Page 143, church at Stoke Pogis ==> church at Stoke Poges
Page 156, 23-4. N te the metaphor ==> 23-4. Note the metaphor
Page 164, HOME THOUGHTS, FROM THE SEA. ==> HOME-THOUGHTS, FROM THE SEA.





End of the Project Gutenberg EBook of Narrative and Lyric Poems (Second
Series) for Use in the Lower Scho, by Various

*** END OF THIS PROJECT GUTENBERG EBOOK NARRATIVE AND LYRIC POEMS ***

***** This file should be named 48484-0.txt or 48484-0.zip *****
This and all associated files of various formats will be found in:
	http://www.gutenberg.org/4/8/4/8/48484/

Produced by David T. Jones, Mardi Desjardins and the online
Distributed Proofreaders Canada team at
	http://www.pgdpcanada.net


Updated editions will replace the previous one--the old editions
will be renamed.

Creating the works from public domain print editions means that no
one owns a United States copyright in these works, so the Foundation
(and you!) can copy and distribute it in the United States without
permission and without paying copyright royalties.  Special rules,
set forth in the General Terms of Use part of this license, apply to
copying and distributing Project Gutenberg-tm electronic works to
protect the PROJECT GUTENBERG-tm concept and trademark.  Project
Gutenberg is a registered trademark, and may not be used if you
charge for the eBooks, unless you receive specific permission.  If you
do not charge anything for copies of this eBook, complying with the
rules is very easy.  You may use this eBook for nearly any purpose
such as creation of derivative works, reports, performances and
research.  They may be modified and printed and given away--you may do
practically ANYTHING with public domain eBooks.  Redistribution is
subject to the trademark license, especially commercial
redistribution.



*** START: FULL LICENSE ***

THE FULL PROJECT GUTENBERG LICENSE
PLEASE READ THIS BEFORE YOU DISTRIBUTE OR USE THIS WORK

To protect the Project Gutenberg-tm mission of promoting the free
distribution of electronic works, by using or distributing this work
(or any other work associated in any way with the phrase "Project
Gutenberg"), you agree to comply with all the terms of the Full Project
Gutenberg-tm License available with this file or online at
  www.gutenberg.org/license.


Section 1.  General Terms of Use and Redistributing Project Gutenberg-tm
electronic works

1.A.  By reading or using any part of this Project Gutenberg-tm
electronic work, you indicate that you have read, understand, agree to
and accept all the terms of this license and intellectual property
(trademark/copyright) agreement.  If you do not agree to abide by all
the terms of this agreement, you must cease using and return or destroy
all copies of Project Gutenberg-tm electronic works in your possession.
If you paid a fee for obtaining a copy of or access to a Project
Gutenberg-tm electronic work and you do not agree to be bound by the
terms of this agreement, you may obtain a refund from the person or
entity to whom you paid the fee as set forth in paragraph 1.E.8.

1.B.  "Project Gutenberg" is a registered trademark.  It may only be
used on or associated in any way with an electronic work by people who
agree to be bound by the terms of this agreement.  There are a few
things that you can do with most Project Gutenberg-tm electronic works
even without complying with the full terms of this agreement.  See
paragraph 1.C below.  There are a lot of things you can do with Project
Gutenberg-tm electronic works if you follow the terms of this agreement
and help preserve free future access to Project Gutenberg-tm electronic
works.  See paragraph 1.E below.

1.C.  The Project Gutenberg Literary Archive Foundation ("the Foundation"
or PGLAF), owns a compilation copyright in the collection of Project
Gutenberg-tm electronic works.  Nearly all the individual works in the
collection are in the public domain in the United States.  If an
individual work is in the public domain in the United States and you are
located in the United States, we do not claim a right to prevent you from
copying, distributing, performing, displaying or creating derivative
works based on the work as long as all references to Project Gutenberg
are removed.  Of course, we hope that you will support the Project
Gutenberg-tm mission of promoting free access to electronic works by
freely sharing Project Gutenberg-tm works in compliance with the terms of
this agreement for keeping the Project Gutenberg-tm name associated with
the work.  You can easily comply with the terms of this agreement by
keeping this work in the same format with its attached full Project
Gutenberg-tm License when you share it without charge with others.

1.D.  The copyright laws of the place where you are located also govern
what you can do with this work.  Copyright laws in most countries are in
a constant state of change.  If you are outside the United States, check
the laws of your country in addition to the terms of this agreement
before downloading, copying, displaying, performing, distributing or
creating derivative works based on this work or any other Project
Gutenberg-tm work.  The Foundation makes no representations concerning
the copyright status of any work in any country outside the United
States.

1.E.  Unless you have removed all references to Project Gutenberg:

1.E.1.  The following sentence, with active links to, or other immediate
access to, the full Project Gutenberg-tm License must appear prominently
whenever any copy of a Project Gutenberg-tm work (any work on which the
phrase "Project Gutenberg" appears, or with which the phrase "Project
Gutenberg" is associated) is accessed, displayed, performed, viewed,
copied or distributed:

This eBook is for the use of anyone anywhere at no cost and with
almost no restrictions whatsoever.  You may copy it, give it away or
re-use it under the terms of the Project Gutenberg License included
with this eBook or online at www.gutenberg.org

1.E.2.  If an individual Project Gutenberg-tm electronic work is derived
from the public domain (does not contain a notice indicating that it is
posted with permission of the copyright holder), the work can be copied
and distributed to anyone in the United States without paying any fees
or charges.  If you are redistributing or providing access to a work
with the phrase "Project Gutenberg" associated with or appearing on the
work, you must comply either with the requirements of paragraphs 1.E.1
through 1.E.7 or obtain permission for the use of the work and the
Project Gutenberg-tm trademark as set forth in paragraphs 1.E.8 or
1.E.9.

1.E.3.  If an individual Project Gutenberg-tm electronic work is posted
with the permission of the copyright holder, your use and distribution
must comply with both paragraphs 1.E.1 through 1.E.7 and any additional
terms imposed by the copyright holder.  Additional terms will be linked
to the Project Gutenberg-tm License for all works posted with the
permission of the copyright holder found at the beginning of this work.

1.E.4.  Do not unlink or detach or remove the full Project Gutenberg-tm
License terms from this work, or any files containing a part of this
work or any other work associated with Project Gutenberg-tm.

1.E.5.  Do not copy, display, perform, distribute or redistribute this
electronic work, or any part of this electronic work, without
prominently displaying the sentence set forth in paragraph 1.E.1 with
active links or immediate access to the full terms of the Project
Gutenberg-tm License.

1.E.6.  You may convert to and distribute this work in any binary,
compressed, marked up, nonproprietary or proprietary form, including any
word processing or hypertext form.  However, if you provide access to or
distribute copies of a Project Gutenberg-tm work in a format other than
"Plain Vanilla ASCII" or other format used in the official version
posted on the official Project Gutenberg-tm web site (www.gutenberg.org),
you must, at no additional cost, fee or expense to the user, provide a
copy, a means of exporting a copy, or a means of obtaining a copy upon
request, of the work in its original "Plain Vanilla ASCII" or other
form.  Any alternate format must include the full Project Gutenberg-tm
License as specified in paragraph 1.E.1.

1.E.7.  Do not charge a fee for access to, viewing, displaying,
performing, copying or distributing any Project Gutenberg-tm works
unless you comply with paragraph 1.E.8 or 1.E.9.

1.E.8.  You may charge a reasonable fee for copies of or providing
access to or distributing Project Gutenberg-tm electronic works provided
that

- You pay a royalty fee of 20% of the gross profits you derive from
     the use of Project Gutenberg-tm works calculated using the method
     you already use to calculate your applicable taxes.  The fee is
     owed to the owner of the Project Gutenberg-tm trademark, but he
     has agreed to donate royalties under this paragraph to the
     Project Gutenberg Literary Archive Foundation.  Royalty payments
     must be paid within 60 days following each date on which you
     prepare (or are legally required to prepare) your periodic tax
     returns.  Royalty payments should be clearly marked as such and
     sent to the Project Gutenberg Literary Archive Foundation at the
     address specified in Section 4, "Information about donations to
     the Project Gutenberg Literary Archive Foundation."

- You provide a full refund of any money paid by a user who notifies
     you in writing (or by e-mail) within 30 days of receipt that s/he
     does not agree to the terms of the full Project Gutenberg-tm
     License.  You must require such a user to return or
     destroy all copies of the works possessed in a physical medium
     and discontinue all use of and all access to other copies of
     Project Gutenberg-tm works.

- You provide, in accordance with paragraph 1.F.3, a full refund of any
     money paid for a work or a replacement copy, if a defect in the
     electronic work is discovered and reported to you within 90 days
     of receipt of the work.

- You comply with all other terms of this agreement for free
     distribution of Project Gutenberg-tm works.

1.E.9.  If you wish to charge a fee or distribute a Project Gutenberg-tm
electronic work or group of works on different terms than are set
forth in this agreement, you must obtain permission in writing from
both the Project Gutenberg Literary Archive Foundation and Michael
Hart, the owner of the Project Gutenberg-tm trademark.  Contact the
Foundation as set forth in Section 3 below.

1.F.

1.F.1.  Project Gutenberg volunteers and employees expend considerable
effort to identify, do copyright research on, transcribe and proofread
public domain works in creating the Project Gutenberg-tm
collection.  Despite these efforts, Project Gutenberg-tm electronic
works, and the medium on which they may be stored, may contain
"Defects," such as, but not limited to, incomplete, inaccurate or
corrupt data, transcription errors, a copyright or other intellectual
property infringement, a defective or damaged disk or other medium, a
computer virus, or computer codes that damage or cannot be read by
your equipment.

1.F.2.  LIMITED WARRANTY, DISCLAIMER OF DAMAGES - Except for the "Right
of Replacement or Refund" described in paragraph 1.F.3, the Project
Gutenberg Literary Archive Foundation, the owner of the Project
Gutenberg-tm trademark, and any other party distributing a Project
Gutenberg-tm electronic work under this agreement, disclaim all
liability to you for damages, costs and expenses, including legal
fees.  YOU AGREE THAT YOU HAVE NO REMEDIES FOR NEGLIGENCE, STRICT
LIABILITY, BREACH OF WARRANTY OR BREACH OF CONTRACT EXCEPT THOSE
PROVIDED IN PARAGRAPH 1.F.3.  YOU AGREE THAT THE FOUNDATION, THE
TRADEMARK OWNER, AND ANY DISTRIBUTOR UNDER THIS AGREEMENT WILL NOT BE
LIABLE TO YOU FOR ACTUAL, DIRECT, INDIRECT, CONSEQUENTIAL, PUNITIVE OR
INCIDENTAL DAMAGES EVEN IF YOU GIVE NOTICE OF THE POSSIBILITY OF SUCH
DAMAGE.

1.F.3.  LIMITED RIGHT OF REPLACEMENT OR REFUND - If you discover a
defect in this electronic work within 90 days of receiving it, you can
receive a refund of the money (if any) you paid for it by sending a
written explanation to the person you received the work from.  If you
received the work on a physical medium, you must return the medium with
your written explanation.  The person or entity that provided you with
the defective work may elect to provide a replacement copy in lieu of a
refund.  If you received the work electronically, the person or entity
providing it to you may choose to give you a second opportunity to
receive the work electronically in lieu of a refund.  If the second copy
is also defective, you may demand a refund in writing without further
opportunities to fix the problem.

1.F.4.  Except for the limited right of replacement or refund set forth
in paragraph 1.F.3, this work is provided to you 'AS-IS', WITH NO OTHER
WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
WARRANTIES OF MERCHANTABILITY OR FITNESS FOR ANY PURPOSE.

1.F.5.  Some states do not allow disclaimers of certain implied
warranties or the exclusion or limitation of certain types of damages.
If any disclaimer or limitation set forth in this agreement violates the
law of the state applicable to this agreement, the agreement shall be
interpreted to make the maximum disclaimer or limitation permitted by
the applicable state law.  The invalidity or unenforceability of any
provision of this agreement shall not void the remaining provisions.

1.F.6.  INDEMNITY - You agree to indemnify and hold the Foundation, the
trademark owner, any agent or employee of the Foundation, anyone
providing copies of Project Gutenberg-tm electronic works in accordance
with this agreement, and any volunteers associated with the production,
promotion and distribution of Project Gutenberg-tm electronic works,
harmless from all liability, costs and expenses, including legal fees,
that arise directly or indirectly from any of the following which you do
or cause to occur: (a) distribution of this or any Project Gutenberg-tm
work, (b) alteration, modification, or additions or deletions to any
Project Gutenberg-tm work, and (c) any Defect you cause.


Section  2.  Information about the Mission of Project Gutenberg-tm

Project Gutenberg-tm is synonymous with the free distribution of
electronic works in formats readable by the widest variety of computers
including obsolete, old, middle-aged and new computers.  It exists
because of the efforts of hundreds of volunteers and donations from
people in all walks of life.

Volunteers and financial support to provide volunteers with the
assistance they need are critical to reaching Project Gutenberg-tm's
goals and ensuring that the Project Gutenberg-tm collection will
remain freely available for generations to come.  In 2001, the Project
Gutenberg Literary Archive Foundation was created to provide a secure
and permanent future for Project Gutenberg-tm and future generations.
To learn more about the Project Gutenberg Literary Archive Foundation
and how your efforts and donations can help, see Sections 3 and 4
and the Foundation information page at www.gutenberg.org


Section 3.  Information about the Project Gutenberg Literary Archive
Foundation

The Project Gutenberg Literary Archive Foundation is a non profit
501(c)(3) educational corporation organized under the laws of the
state of Mississippi and granted tax exempt status by the Internal
Revenue Service.  The Foundation's EIN or federal tax identification
number is 64-6221541.  Contributions to the Project Gutenberg
Literary Archive Foundation are tax deductible to the full extent
permitted by U.S. federal laws and your state's laws.

The Foundation's principal office is located at 4557 Melan Dr. S.
Fairbanks, AK, 99712., but its volunteers and employees are scattered
throughout numerous locations.  Its business office is located at 809
North 1500 West, Salt Lake City, UT 84116, (801) 596-1887.  Email
contact links and up to date contact information can be found at the
Foundation's web site and official page at www.gutenberg.org/contact

For additional contact information:
     Dr. Gregory B. Newby
     Chief Executive and Director
     gbnewby@pglaf.org

Section 4.  Information about Donations to the Project Gutenberg
Literary Archive Foundation

Project Gutenberg-tm depends upon and cannot survive without wide
spread public support and donations to carry out its mission of
increasing the number of public domain and licensed works that can be
freely distributed in machine readable form accessible by the widest
array of equipment including outdated equipment.  Many small donations
($1 to $5,000) are particularly important to maintaining tax exempt
status with the IRS.

The Foundation is committed to complying with the laws regulating
charities and charitable donations in all 50 states of the United
States.  Compliance requirements are not uniform and it takes a
considerable effort, much paperwork and many fees to meet and keep up
with these requirements.  We do not solicit donations in locations
where we have not received written confirmation of compliance.  To
SEND DONATIONS or determine the status of compliance for any
particular state visit www.gutenberg.org/donate

While we cannot and do not solicit contributions from states where we
have not met the solicitation requirements, we know of no prohibition
against accepting unsolicited donations from donors in such states who
approach us with offers to donate.

International donations are gratefully accepted, but we cannot make
any statements concerning tax treatment of donations received from
outside the United States.  U.S. laws alone swamp our small staff.

Please check the Project Gutenberg Web pages for current donation
methods and addresses.  Donations are accepted in a number of other
ways including checks, online payments and credit card donations.
To donate, please visit:  www.gutenberg.org/donate


Section 5.  General Information About Project Gutenberg-tm electronic
works.

Professor Michael S. Hart was the originator of the Project Gutenberg-tm
concept of a library of electronic works that could be freely shared
with anyone.  For forty years, he produced and distributed Project
Gutenberg-tm eBooks with only a loose network of volunteer support.

Project Gutenberg-tm eBooks are often created from several printed
editions, all of which are confirmed as Public Domain in the U.S.
unless a copyright notice is included.  Thus, we do not necessarily
keep eBooks in compliance with any particular paper edition.

Most people start at our Web site which has the main PG search facility:

     www.gutenberg.org

This Web site includes information about Project Gutenberg-tm,
including how to make donations to the Project Gutenberg Literary
Archive Foundation, how to help produce our new eBooks, and how to
subscribe to our email newsletter to hear about new eBooks.
`