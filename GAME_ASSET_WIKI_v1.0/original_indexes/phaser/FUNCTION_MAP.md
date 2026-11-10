# FUNCTION_MAP — feature to module/function lookup

Entries are source-confirmed names and module IDs; broader feature labels are organizational inference. Offsets for each function and method: `ASSET_INDEX.json`.

## Engine lifecycle and scheduling

- `50127` @75058: `initialize`, `boot`, `texturesReady`, `start`, `step`, `headlessStep`, `onHidden`, `pause`, `onVisible`, `resume`, `onBlur`, `onFocus`, `getFrame`, `getTime`, `destroy`, `runDestroy`.
- `65898` @78354: `initialize`, `blur`, `focus`, `pause`, `resume`, `resetDelta`, `start`, `smoothDelta`, `updateFPS`, `stepLimitFPS`, `step`, `tick`, `sleep`, `wake`, `getDuration`, `getDurationMS`, `stop`, `destroy`.
- `43092` @142499: `initialize`, `start`, `stop`, `destroy`.
- `51085` @82058: unnamed local implementation.
- `69547` @66612: `initialize`.
- `86054` @72961: unnamed local implementation.
- `8054` @66420: unnamed local implementation.

## Animations

- `42099` @12563: `initialize`, `getTotalFrames`, `calculateDuration`, `addFrame`, `addFrameAt`, `checkFrame`, `getFirstTick`, `getFrameAt`, `getFrames`, `getNextTick`, `getFrameByProgress`, `nextFrame`, `handleYoyoFrame`, `getLastFrame`, `previousFrame`, `updateAndGetNextTick`, `removeFrame`, `removeFrameAt`, `repeatAnimation`, `toJSON`, `updateFrameSequence`, `pause`.
- `41138` @18051: `initialize`, `toJSON`, `destroy`.
- `60848` @18499: `initialize`, `boot`, `addMix`, `removeMix`, `getMix`, `add`, `exists`, `createFromAseprite`, `create`, `fromJSON`, `generateFrameNames`, `generateFrameNumbers`, `get`, `getAnimsFromTexture`, `pauseAll`, `play`, `staggerPlay`, `remove`, `resumeAll`, `toJSON`, `destroy`.
- `9674` @23186: `initialize`, `chain`, `getName`, `getFrameName`, `load`, `pause`, `resume`, `playAfterDelay`, `playAfterRepeat`, `play`, `playReverse`, `startAnimation`, `handleStart`, `handleRepeat`, `handleStop`, `handleComplete`, `emitEvents`, `reverse`, `getProgress`, `setProgress`, `setRepeat`, `globalRemove`.
- `74943` @32655: `ADD_ANIMATION`, `ANIMATION_COMPLETE`, `ANIMATION_COMPLETE_KEY`, `ANIMATION_REPEAT`, `ANIMATION_RESTART`, `ANIMATION_START`, `ANIMATION_STOP`, `ANIMATION_UPDATE`, `PAUSE_ALL`, `REMOVE_ANIMATION`, `RESUME_ALL`.

## Camera and camera effects

- `71911` @34693: `initialize`, `addToRenderList`, `setOrigin`, `getScroll`, `centerOnX`, `centerOnY`, `centerOn`, `centerToBounds`, `centerToSize`, `cull`, `getWorldPoint`, `ignore`, `clampX`, `clampY`, `removeBounds`, `setAngle`, `setBackgroundColor`, `setBounds`, `getBounds`, `setName`, `setPosition`, `setRotation`.
- `38058` @42133: `initialize`, `setDeadzone`, `fadeIn`, `fadeOut`, `fadeFrom`, `fade`, `flash`, `shake`, `pan`, `rotateTo`, `zoomTo`, `preRender`, `setLerp`, `setFollowOffset`, `startFollow`, `stopFollow`, `resetFX`, `update`, `destroy`.
- `32743` @46050: `initialize`, `boot`, `start`, `add`, `addExisting`, `getNextID`, `getTotal`, `fromJSON`, `getCamera`, `getCamerasBelowPointer`, `remove`, `render`, `getVisibleChildren`, `resetAll`, `update`, `onResize`, `resize`, `shutdown`, `destroy`.
- `5020` @50174: `initialize`, `start`, `update`, `postRenderCanvas`, `postRenderWebGL`, `effectComplete`, `reset`, `destroy`.
- `10662` @52147: `initialize`, `start`, `update`, `postRenderCanvas`, `postRenderWebGL`, `effectComplete`, `reset`, `destroy`.
- `20359` @53856: `initialize`, `start`, `update`, `effectComplete`, `reset`, `destroy`.
- `34208` @55605: `initialize`, `start`, `update`, `effectComplete`, `reset`, `destroy`.
- `30330` @57820: `initialize`, `start`, `preRender`, `update`, `effectComplete`, `reset`, `destroy`.
- `45641` @59533: `initialize`, `start`, `update`, `effectComplete`, `reset`, `destroy`.
- `19715` @61874: `DESTROY`, `FADE_IN_COMPLETE`, `FADE_IN_START`, `FADE_OUT_COMPLETE`, `FADE_OUT_START`, `FLASH_COMPLETE`, `FLASH_START`, `FOLLOW_UPDATE`, `PAN_COMPLETE`, `PAN_START`, `POST_RENDER`, `PRE_RENDER`, `ROTATE_COMPLETE`, `ROTATE_START`, `SHAKE_COMPLETE`, `SHAKE_START`, `ZOOM_COMPLETE`, `ZOOM_START`.
- `63091` @62424: `initialize`, `start`, `stop`, `setCamera`, `update`, `destroy`.
- `58818` @63806: `initialize`, `start`, `stop`, `setCamera`, `update`, `destroy`.

## Events and data

- `50792` @617: unnamed local implementation.
- `47565` @143512: `initialize`, `shutdown`, `destroy`.
- `45893` @99790: `initialize`, `get`, `getAll`, `query`, `set`, `inc`, `toggle`, `setValue`, `get`, `set`, `each`, `merge`, `remove`, `removeValue`, `pop`, `has`, `setFreeze`, `reset`, `destroy`, `get`, `set`, `get`.
- `63646` @102510: `initialize`, `boot`, `start`, `shutdown`, `destroy`.
- `2161` @33096: `initialize`, `add`, `has`, `exists`, `get`, `remove`, `getKeys`, `destroy`.
- `24047` @33739: `initialize`, `addCustom`, `destroy`.

## Geometry and curves

- `80021` @86421: `initialize`, `draw`, `getBounds`, `getDistancePoints`, `getEndPoint`, `getLength`, `getLengths`, `getPointAt`, `getPoints`, `getRandomPoint`, `getSpacedPoints`, `getStartPoint`, `getTangent`, `getTangentAt`, `getTFromDistance`, `getUtoTmapping`, `updateArcLengths`.
- `46728` @85421: `initialize`, `getStartPoint`, `getResolution`, `getPoint`, `draw`, `toJSON`.
- `73825` @88851: `initialize`, `getStartPoint`, `getResolution`, `getPoint`, `setXRadius`, `setYRadius`, `setWidth`, `setHeight`, `setStartAngle`, `setEndAngle`, `setClockwise`, `setRotation`, `get`, `set`, `get`, `set`, `get`, `set`, `get`, `set`, `get`, `set`.
- `33951` @91469: `initialize`, `getBounds`, `getStartPoint`, `getResolution`, `getPoint`, `getPointAt`, `getTangent`, `getUtoTmapping`, `draw`, `toJSON`.
- `14744` @92617: `initialize`, `getStartPoint`, `getResolution`, `getPoint`, `draw`, `toJSON`.
- `42534` @93531: `initialize`, `addPoints`, `addPoint`, `getStartPoint`, `getResolution`, `getPoint`, `toJSON`.
- `46669` @95138: `initialize`, `add`, `circleTo`, `closePath`, `cubicBezierTo`, `quadraticBezierTo`, `draw`, `ellipseTo`, `fromJSON`, `getBounds`, `getCurveLengths`, `getCurveAt`, `getEndPoint`, `getLength`, `getPoint`, `getPoints`, `getRandomPoint`, `getSpacedPoints`, `getStartPoint`, `getTangent`, `lineTo`, `splineTo`.
- `68618` @94755: `initialize`, `getPoint`, `getPointAt`, `getResolution`, `getLength`, `toJSON`.

## Rendering and masks

- `86054` @72961: unnamed local implementation.
- `80661` @137236: `initialize`, `setShape`, `setInvertAlpha`, `preRenderWebGL`, `applyStencil`, `postRenderWebGL`, `preRenderCanvas`, `postRenderCanvas`, `destroy`.
- `6858` @136636: `initialize`, `setBitmap`, `preRenderWebGL`, `postRenderWebGL`, `preRenderCanvas`, `postRenderCanvas`, `destroy`.
- `89422` @113120: `initialize`, `set`, `reset`, `getData`, `brightness`, `saturate`, `desaturate`, `hue`, `grayscale`, `blackWhite`, `contrast`, `negative`, `desaturateLuminance`, `sepia`, `night`, `lsd`, `brown`, `vintagePinhole`, `kodachrome`, `technicolor`, `polaroid`, `shiftToBGR`.
- `73894` @138860: `initialize`.

## Physics

- `24047` @33739: `initialize`, `addCustom`, `destroy`.
- `86689` @638124: `initialize`, `boot`, `start`, `enableUpdate`, `disableUpdate`, `getConfig`, `nextCategory`, `overlap`, `collide`, `collideTiles`, `overlapTiles`, `pause`, `resume`, `accelerateTo`, `accelerateToObject`, `closest`, `furthest`, `moveTo`, `moveToObject`, `velocityFromAngle`, `velocityFromRotation`, `overlapRect`.
- `37742` @641965: `initialize`, `updateBounds`, `updateCenter`, `updateFromGameObject`, `resetFlags`, `preUpdate`, `update`, `postUpdate`, `setBoundsRectangle`, `checkWorldBounds`, `setOffset`, `setGameObject`, `setSize`, `setCircle`, `reset`, `stop`, `getBounds`, `hitTest`, `onFloor`, `onCeiling`, `onWall`, `deltaAbsX`.
- `64897` @656793: unnamed local implementation.
- `45170` @657636: unnamed local implementation.
- `60758` @658459: `initialize`, `createCallbackHandler`, `removeCallbackHandler`, `setVelocity`, `setVelocityX`, `setVelocityY`.
- `72624` @666030: `initialize`, `setGameObject`, `updateFromGameObject`, `setOffset`, `setSize`, `setCircle`, `updateCenter`, `reset`, `stop`, `getBounds`, `hitTest`, `postUpdate`, `deltaAbsX`, `deltaAbsY`, `deltaX`, `deltaY`, `deltaZ`, `destroy`, `drawDebug`, `willDrawDebug`, `setMass`, `get`.
- `71464` @671013: `initialize`, `createCallbackHandler`, `removeCallbackHandler`, `createMultipleCallbackHandler`, `refresh`.
- `82248` @672390: `initialize`, `enable`, `enableBody`, `add`, `disable`, `disableBody`, `remove`, `createDebugGraphic`, `setBounds`, `setBoundsCollision`, `pause`, `resume`, `addCollider`, `addOverlap`, `removeCollider`, `setFPS`, `update`, `step`, `singleStep`, `postUpdate`, `updateMotion`, `computeAngularVelocity`.
- `28137` @698252: `initialize`, `rectangle`, `trapezoid`, `circle`, `polygon`, `fromVertices`, `fromPhysicsEditor`, `fromSVG`, `fromJSON`, `imageStack`, `stack`, `pyramid`, `chain`, `mesh`, `newtonsCradle`, `car`, `softBody`, `joint`, `spring`, `constraint`, `worldConstraint`, `mouseSpring`.
- `42045` @702851: `initialize`, `boot`, `start`, `getConfig`, `pause`, `resume`, `set60Hz`, `set30Hz`, `step`, `containsPoint`, `intersectPoint`, `intersectRect`, `intersectRay`, `intersectBody`, `overlap`, `setCollisionCategory`, `setCollisionGroup`, `setCollidesWith`, `getMatterBodies`, `setVelocity`, `setVelocityX`, `setVelocityY`.
- `57772` @734658: `setRectangle`, `setCircle`, `setPolygon`, `setTrapezoid`, `setExistingBody`, `setBody`.
- `3875` @741178: `BodyBounds`, `Components`, `Events`, `Factory`, `MatterGameObject`, `Image`, `Matter`, `MatterPhysics`, `PolyDecomp`, `Sprite`, `TileBody`, `PhysicsEditorParser`, `PhysicsJSONParser`, `PointerConstraint`, `World`.
- `27397` @967967: unnamed local implementation.
- `62194` @989237: unnamed local implementation.
- `23029` @1078099: `initialize`, `containsPoint`, `copy`, `getCollisionGroup`, `getTileData`, `getLeft`, `getRight`, `getTop`, `getBottom`, `getBounds`, `getCenterX`, `getCenterY`, `intersects`, `isInteresting`, `resetCollision`, `resetFaces`, `setCollision`, `setCollisionCallback`, `setSize`, `updatePixelXY`, `destroy`, `get`.

## Arcade

- `44563` @695532: `Arcade`, `Matter`.

## Matter

- `44563` @695532: `Arcade`, `Matter`.
- `3875` @741178: `BodyBounds`, `Components`, `Events`, `Factory`, `MatterGameObject`, `Image`, `Matter`, `MatterPhysics`, `PolyDecomp`, `Sprite`, `TileBody`, `PhysicsEditorParser`, `PhysicsJSONParser`, `PointerConstraint`, `World`.
- `53402` @771055: unnamed local implementation.
- `48413` @775088: unnamed local implementation.
- `6790` @779301: unnamed local implementation.
- `13037` @783199: unnamed local implementation.

## Input

- `38058` @42133: `initialize`, `setDeadzone`, `fadeIn`, `fadeOut`, `fadeFrom`, `fade`, `flash`, `shake`, `pan`, `rotateTo`, `zoomTo`, `preRender`, `setLerp`, `setFollowOffset`, `startFollow`, `stopFollow`, `resetFX`, `update`, `destroy`.
- `69547` @66612: `initialize`.
- `50127` @75058: `initialize`, `boot`, `texturesReady`, `start`, `step`, `headlessStep`, `onHidden`, `pause`, `onVisible`, `resume`, `onBlur`, `onFocus`, `getFrame`, `getTime`, `destroy`, `runDestroy`.
- `82264` @112956: `os`, `browser`, `features`, `input`, `audio`, `video`, `fullscreen`, `canvasFeatures`.
- `74561` @357569: `initialize`, `setRounded`, `setSize`, `updateData`, `updateRoundedData`, `arcTo`.
- `7003` @467572: `initialize`, `boot`, `setCanvasOver`, `setCanvasOut`, `preRender`, `setDefaultCursor`, `setCursor`, `resetCursor`, `addPointer`, `updateInputPlugins`, `onTouchStart`, `onTouchMove`, `onTouchEnd`, `onTouchCancel`, `onMouseDown`, `onMouseMove`, `onMouseUp`, `onMouseWheel`, `onPointerLockChange`, `inputCandidate`, `hitTest`, `pointWithinHitArea`.
- `78970` @511358: `initialize`, `boot`, `startListeners`, `stopListeners`, `postUpdate`, `addCapture`, `removeCapture`, `clearCaptures`, `destroy`.
- `28846` @513587: `initialize`, `boot`, `start`, `isActive`, `addCapture`, `removeCapture`, `getCaptures`, `enableGlobalCapture`, `disableGlobalCapture`, `clearCaptures`, `createCursorKeys`, `addKeys`, `addKey`, `removeKey`, `removeAllKeys`, `createCombo`, `checkDown`, `update`, `resetKeys`, `shutdown`, `destroy`, `get`.
- `85098` @523449: `initialize`, `boot`, `disableContextMenu`, `requestPointerLock`, `releasePointerLock`, `startListeners`, `stopListeners`, `destroy`.
- `36210` @528331: `initialize`, `boot`, `disableContextMenu`, `startListeners`, `stopListeners`, `destroy`.

## Keyboard

- `91639` @108725: `get`.
- `51442` @520180: `Events`, `KeyboardManager`, `KeyboardPlugin`, `Key`, `KeyCodes`, `KeyCombo`, `AdvanceKeyCombo`, `ProcessKeyCombo`, `ResetKeyCombo`, `JustDown`, `JustUp`, `DownDuration`, `UpDuration`.

## Scene

- `9674` @23186: `initialize`, `chain`, `getName`, `getFrameName`, `load`, `pause`, `resume`, `playAfterDelay`, `playAfterRepeat`, `play`, `playReverse`, `startAnimation`, `handleStart`, `handleRepeat`, `handleStop`, `handleComplete`, `emitEvents`, `reverse`, `getProgress`, `setProgress`, `setRepeat`, `globalRemove`.
- `32743` @46050: `initialize`, `boot`, `start`, `add`, `addExisting`, `getNextID`, `getTotal`, `fromJSON`, `getCamera`, `getCamerasBelowPointer`, `remove`, `render`, `getVisibleChildren`, `resetAll`, `update`, `onResize`, `resize`, `shutdown`, `destroy`.
- `26638` @66356: `Controls`, `Scene2D`.
- `63646` @102510: `initialize`, `boot`, `start`, `shutdown`, `destroy`.
- `6858` @136636: `initialize`, `setBitmap`, `preRenderWebGL`, `postRenderWebGL`, `preRenderCanvas`, `postRenderCanvas`, `destroy`.
- `44553` @146756: `initialize`, `setTexture`.
- `8050` @151740: `initialize`, `boot`, `addChildCallback`, `removeChildCallback`, `start`, `queueDepthSort`, `depthSort`, `sortByDepth`, `getChildren`, `shutdown`, `destroy`.
- `95643` @153280: `initialize`, `setActive`, `setName`, `setState`, `setDataEnabled`, `setData`, `incData`, `toggleData`, `getData`, `setInteractive`, `disableInteractive`, `removeInteractive`, `addedToScene`, `removedFromScene`, `update`, `toJSON`, `willRender`, `getIndexList`, `addToDisplayList`, `addToUpdateList`, `removeFromDisplayList`, `removeFromUpdateList`.
- `44603` @156867: `initialize`, `boot`, `start`, `shutdown`, `destroy`.
- `39429` @157780: `initialize`, `boot`, `start`, `existing`, `shutdown`, `destroy`.
- `45027` @159205: `initialize`, `boot`, `start`, `sceneUpdate`, `shutdown`, `destroy`.
- `72566` @169001: unnamed local implementation.
- `22186` @171792: `initialize`, `setLeftAlign`, `setCenterAlign`, `setRightAlign`, `setFontSize`, `setLetterSpacing`, `setLineSpacing`, `setText`, `setDropShadow`, `setCharacterTint`, `setWordTint`, `getTextBounds`, `getCharacterAt`, `updateDisplayOrigin`, `setFont`, `setMaxWidth`, `setDisplaySize`, `set`, `get`, `set`, `get`, `set`.
- `34914` @178167: unnamed local implementation.
- `9403` @181861: unnamed local implementation.
- `12709` @182099: unnamed local implementation.
- `72699` @197487: `initPipeline`, `setPipeline`, `setPipelineData`, `resetPipeline`, `getPipelineName`.
- `17581` @198301: `initPostPipeline`, `setPostPipeline`, `setPostPipelineData`, `getPostPipeline`, `resetPostPipeline`, `removePostPipeline`, `clearFX`.
- `37726` @200565: `setTexture`, `setFrame`.
- `31559` @212300: `initialize`, `get`, `get`, `get`, `get`, `setExclusive`, `getBounds`, `addHandler`, `removeHandler`, `pointToContainer`, `getBoundsTransformMatrix`, `add`, `addAt`, `getAt`, `getIndex`, `sort`, `getByName`, `getRandom`, `getFirst`, `getAll`, `count`, `swap`.
- `77143` @218401: unnamed local implementation.
- `24961` @218663: unnamed local implementation.
- `49381` @223944: unnamed local implementation.
- `2611` @225189: unnamed local implementation.
- `62980` @225437: unnamed local implementation.
- `44947` @225504: unnamed local implementation.
- `51708` @226004: `ADDED_TO_SCENE`, `DESTROY`, `REMOVED_FROM_SCENE`, `VIDEO_COMPLETE`, `VIDEO_CREATED`, `VIDEO_ERROR`, `VIDEO_LOCKED`, `VIDEO_LOOP`, `VIDEO_METADATA`, `VIDEO_PLAY`, `VIDEO_PLAYING`, `VIDEO_SEEKED`, `VIDEO_SEEKING`, `VIDEO_STALLED`, `VIDEO_STOP`, `VIDEO_TEXTURE`, `VIDEO_UNLOCKED`, `VIDEO_UNSUPPORTED`.
- `56315` @226884: unnamed local implementation.
- `87079` @237418: unnamed local implementation.
- `1201` @237616: unnamed local implementation.
- `26479` @240266: `initialize`, `addedToScene`, `removedFromScene`, `create`, `createMultiple`, `createFromConfig`, `preUpdate`, `add`, `addMultiple`, `remove`, `clear`, `contains`, `getChildren`, `getLength`, `getMatching`, `getFirst`, `getFirstNth`, `getLast`, `getLastNth`, `getHandler`, `get`, `getFirstAlive`.
- `94975` @249204: unnamed local implementation.
- `3385` @249312: unnamed local implementation.
- `82459` @250026: unnamed local implementation.
- `2117` @250264: unnamed local implementation.
- `25179` @256933: unnamed local implementation.
- `20005` @257150: unnamed local implementation.
- `61356` @259123: `initialize`, `addPointLight`, `enable`, `disable`, `getLights`, `sortByDistance`, `setAmbientColor`, `getMaxVisibleLights`, `getLightCount`, `addLight`, `removeLight`, `shutdown`, `destroy`.
- `88992` @260627: `initialize`, `boot`, `destroy`.
- `4703` @261085: `initialize`, `addedToScene`, `removedFromScene`, `panX`, `panY`, `panZ`, `setPerspective`, `setOrtho`, `clear`, `addVerticesFromObj`, `sortByDepth`, `depthSort`, `addVertex`, `addFace`, `addVertices`, `getFaceCount`, `getVertexCount`, `getFace`, `hasFaceAt`, `getFaceAt`, `setDebug`, `isDirty`.
- `20527` @266740: unnamed local implementation.
- `9225` @267144: unnamed local implementation.
- `28279` @272910: unnamed local implementation.
- `47521` @273304: unnamed local implementation.
- `92730` @306749: unnamed local implementation.
- `676` @307019: unnamed local implementation.
- `90145` @311221: unnamed local implementation.
- `33663` @311397: `initialize`, `get`, `get`, `setGridSize`, `setSizeToFrame`, `setViewHeight`, `createCheckerboard`, `removeCheckerboard`, `play`, `playReverse`, `playAfterDelay`, `playAfterRepeat`, `stop`, `stopAfterDelay`, `stopAfterRepeat`, `stopOnFrame`, `preUpdate`, `preDestroy`.
- `56015` @314407: unnamed local implementation.
- `30985` @314910: unnamed local implementation.
- `71255` @316209: unnamed local implementation.
- `34495` @318712: unnamed local implementation.
- `60505` @318981: unnamed local implementation.
- `26209` @323889: unnamed local implementation.
- `96819` @324237: unnamed local implementation.
- `74177` @334503: unnamed local implementation.
- `42563` @339983: unnamed local implementation.
- `40511` @341997: unnamed local implementation.
- `1543` @343996: unnamed local implementation.
- `34137` @346662: unnamed local implementation.
- `3933` @349691: unnamed local implementation.
- `49803` @352519: unnamed local implementation.
- `2481` @354955: unnamed local implementation.
- `64827` @356978: unnamed local implementation.
- `87959` @359932: unnamed local implementation.
- `93697` @362436: unnamed local implementation.
- `45245` @364271: unnamed local implementation.
- `46409` @366794: unnamed local implementation.
- `50171` @368715: `initialize`, `initRTL`, `runWordWrap`, `advancedWordWrap`, `basicWordWrap`, `getWrappedText`, `setText`, `appendText`, `setStyle`, `setFont`, `setFontFamily`, `setFontSize`, `setFontStyle`, `setFixedSize`, `setBackgroundColor`, `setFill`, `setColor`, `setStroke`, `setShadow`, `setShadowOffset`, `setShadowColor`, `setShadowBlur`.
- `68005` @377536: unnamed local implementation.
- `20839` @383978: `initialize`, `setTexture`, `setFrame`, `setTilePosition`, `setTileScale`, `updateTileTexture`, `updateCanvas`, `preDestroy`, `get`, `set`, `get`, `set`, `get`, `set`, `get`, `set`.
- `14167` @388236: unnamed local implementation.
- `91681` @388544: unnamed local implementation.
- `11511` @401453: unnamed local implementation.
- `89025` @401669: unnamed local implementation.
- `95261` @403288: unnamed local implementation.
- `84175` @403472: unnamed local implementation.
- `56654` @506873: `initialize`, `boot`, `start`, `isActive`, `startListeners`, `stopListeners`, `disconnectAll`, `refreshPads`, `getAll`, `getPad`, `update`, `shutdown`, `destroy`, `get`, `get`, `get`, `get`, `get`.
- `74261` @535705: `initialize`, `boot`, `pluginStart`, `setBaseURL`, `setPath`, `setPrefix`, `setCORS`, `addFile`, `keyExists`, `addPack`, `removePack`, `isLoading`, `isReady`, `start`, `updateProgress`, `update`, `checkLoadQueue`, `nextFile`, `fileProcessComplete`, `loadComplete`, `flagForRemoval`, `saveJSON`.
- `48988` @574487: `initialize`, `onProcess`.
- `88423` @577496: `initialize`, `onProcess`, `addToCache`.
- `56812` @578291: `initialize`, `onProcess`.
- `64589` @585978: `AnimationJSONFile`, `AsepriteFile`, `AtlasJSONFile`, `AtlasXMLFile`, `AudioFile`, `AudioSpriteFile`, `BinaryFile`, `BitmapFontFile`, `CompressedTextureFile`, `CSSFile`, `FontFile`, `GLSLFile`, `HTML5AudioFile`, `HTMLFile`, `HTMLTextureFile`, `ImageFile`, `JSONFile`, `MultiAtlasFile`, `MultiScriptFile`, `OBJFile`.
- `66022` @655098: `initialize`, `collider`, `overlap`, `existing`, `staticImage`, `image`, `staticSprite`, `sprite`, `staticGroup`, `group`, `body`, `staticBody`, `destroy`.
- `68243` @715587: `initialize`, `setCompositeRenderStyle`, `setBodyRenderStyle`, `setConstraintRenderStyle`, `setEventsProxy`, `setBounds`, `updateWall`, `createDebugGraphic`, `disableGravity`, `setGravity`, `create`, `add`, `remove`, `removeConstraint`, `convertTilemapLayer`, `convertTiles`, `nextGroup`, `nextCategory`, `pause`, `resume`, `update`, `step`.
- `52018` @806334: `initialize`, `init`, `start`, `stop`, `destroy`.
- `77332` @807664: `initialize`, `boot`, `addToScene`, `getDefaultScenePlugins`, `installScenePlugin`, `install`, `getIndex`, `getEntry`, `isActive`, `start`, `createEntry`, `stop`, `get`, `getClass`, `removeGlobalPlugin`, `removeScenePlugin`, `registerGameObject`, `removeGameObject`, `registerFileType`, `destroy`.
- `45145` @811671: `initialize`, `boot`, `destroy`.
- `18922` @812002: `BasePlugin`, `DefaultPlugins`, `PluginCache`, `PluginManager`, `ScenePlugin`.
- `68627` @813718: `initialize`, `init`, `boot`, `onResize`, `resize`, `resetTransform`, `setBlendMode`, `setContext`, `setAlpha`, `preRender`, `render`, `postRender`, `snapshotCanvas`, `snapshot`, `snapshotArea`, `snapshotPixel`, `batchSprite`, `destroy`.
- `52106` @968240: unnamed local implementation.
- `60903` @969229: `initialize`, `bootQueue`, `processQueue`, `add`, `remove`, `bootScene`, `loadComplete`, `payloadComplete`, `update`, `render`, `create`, `createSceneFromFunction`, `createSceneFromInstance`, `createSceneFromObject`, `getKey`, `getScenes`, `getScene`, `isActive`, `isPaused`, `isVisible`, `isSleeping`, `pause`.
- `52209` @978830: `initialize`, `boot`, `pluginStart`, `start`, `restart`, `transition`, `checkValidTransition`, `step`, `transitionComplete`, `add`, `launch`, `run`, `pause`, `resume`, `sleep`, `wake`, `switch`, `stop`, `setActive`, `setVisible`, `isSleeping`, `isActive`.
- `2368` @984441: `initialize`, `init`, `step`, `render`, `queueDepthSort`, `depthSort`, `pause`, `resume`, `sleep`, `wake`, `getData`, `getStatus`, `canInput`, `isSleeping`, `isActive`, `isPaused`, `isTransitioning`, `isTransitionOut`, `isTransitionIn`, `isVisible`, `setVisible`, `setActive`.
- `69830` @988060: unnamed local implementation.
- `91633` @988341: unnamed local implementation.
- `27462` @1076446: `initialize`, `get`, `set`, `getTypeIncludingTile`, `setTextureAndFrame`, `setPropertiesFromTiledObject`, `setFromJSON`.
- `49075` @1083323: `initialize`, `setRenderOrder`, `addTilesetImage`, `copy`, `createBlankLayer`, `createLayer`, `createFromObjects`, `createFromTiles`, `fill`, `filterObjects`, `filterTiles`, `findByIndex`, `findObject`, `findTile`, `forEachTile`, `getImageIndex`, `getImageLayerNames`, `getIndex`, `getLayer`, `getObjectLayer`, `getObjectLayerNames`, `getLayerIndex`.
- `45939` @1096297: unnamed local implementation.
- `78419` @1108416: unnamed local implementation.
- `55826` @1111353: unnamed local implementation.
- `19951` @1116152: unnamed local implementation.
- `86625` @1116640: unnamed local implementation.
- `14127` @1118215: unnamed local implementation.
- `96897` @1118544: unnamed local implementation.
- `97202` @1125655: unnamed local implementation.
- `28054` @1125982: unnamed local implementation.
- `15108` @1126181: unnamed local implementation.
- `51900` @1126558: unnamed local implementation.
- `97281` @1126952: unnamed local implementation.
- `29650` @1127277: unnamed local implementation.
- `85896` @1127932: unnamed local implementation.
- `33385` @1146678: `initialize`, `boot`, `start`, `addEvent`, `delayedCall`, `clearPendingEvents`, `removeEvent`, `removeAllEvents`, `preUpdate`, `update`, `shutdown`, `destroy`.
- `96120` @1149656: `initialize`, `preUpdate`, `update`, `play`, `pause`, `repeat`, `resume`, `stop`, `reset`, `add`, `clear`, `isPlaying`, `getProgress`, `destroy`.
- `40382` @1154813: `initialize`, `boot`, `start`, `create`, `add`, `addMultiple`, `chain`, `getChainedTweens`, `has`, `existing`, `addCounter`, `stagger`, `setLagSmooth`, `setFps`, `getDelta`, `tick`, `update`, `step`, `remove`, `reset`, `makeActive`, `each`.

## GameObject

- `15802` @146268: `initialize`, `destroy`.
- `72898` @146525: `initialize`, `setActive`, `destroy`.
- `99485` @182340: unnamed local implementation.
- `47059` @187643: `initialize`, `setPadding`, `onFXCopy`, `onFX`, `enable`, `clear`, `remove`, `disable`, `add`, `addGlow`, `addShadow`, `addPixelate`, `addVignette`, `addShine`, `addBlur`, `addGradient`, `addBloom`, `addColorMatrix`, `addCircle`, `addBarrel`, `addDisplacement`, `addWipe`.
- `88171` @501055: unnamed local implementation.
- `86754` @501311: unnamed local implementation.
- `86433` @501349: unnamed local implementation.
- `60709` @501386: unnamed local implementation.
- `47078` @501625: unnamed local implementation.
- `73802` @501661: unnamed local implementation.
- `8214` @502300: `BOOT`, `DESTROY`, `DRAG_END`, `DRAG_ENTER`, `DRAG`, `DRAG_LEAVE`, `DRAG_OVER`, `DRAG_START`, `DROP`, `GAME_OUT`, `GAME_OVER`, `GAMEOBJECT_DOWN`, `GAMEOBJECT_DRAG_END`, `GAMEOBJECT_DRAG_ENTER`, `GAMEOBJECT_DRAG`, `GAMEOBJECT_DRAG_LEAVE`, `GAMEOBJECT_DRAG_OVER`, `GAMEOBJECT_DRAG_START`, `GAMEOBJECT_DROP`, `GAMEOBJECT_MOVE`.
- `4074` @689239: `setDirectControl`, `enableBody`, `disableBody`, `refreshBody`.
- `84057` @892212: `initialize`, `bootFX`, `postBatch`, `onDraw`, `getController`, `copySprite`, `copyFrame`, `copyToGame`, `drawFrame`, `blendFrames`, `blendFramesAdditive`, `clearFrame`, `blitFrame`, `copyFrameRect`, `bindAndDraw`, `destroy`.

## WebGL

- `8054` @66420: unnamed local implementation.
- `96391` @74012: unnamed local implementation.
- `63899` @820510: unnamed local implementation.
- `87124` @820668: unnamed local implementation.
- `36909` @820847: `Events`, `Snapshot`.
- `89966` @822873: `Canvas`, `WebGL`.
- `93567` @946664: `initialize`, `createResource`, `destroy`.
- `26128` @947144: `initialize`, `createResource`, `destroy`.
- `1482` @949512: `initialize`, `createResource`, `destroy`.
- `57183` @952954: `initialize`, `createResource`, `destroy`.
- `9503` @953445: unnamed local implementation.

## Canvas

- `86054` @72961: unnamed local implementation.
- `99584` @83551: unnamed local implementation.
- `89357` @106714: unnamed local implementation.
- `82264` @112956: `os`, `browser`, `features`, `input`, `audio`, `video`, `fullscreen`, `canvasFeatures`.
- `27919` @126183: unnamed local implementation.
- `26253` @128110: `CanvasInterpolation`, `CanvasPool`, `Smoothing`, `TouchAction`, `UserSelect`.
- `27460` @136477: `Align`, `BaseShader`, `Bounds`, `Canvas`, `Color`, `ColorMatrix`, `Masks`, `RGB`.
- `14220` @367132: unnamed local implementation.
- `55830` @819181: `CanvasRenderer`, `GetBlendModes`, `SetTransform`.
- `89966` @822873: `Canvas`, `WebGL`.
- `76531` @953672: `initialize`, `preBoot`, `boot`, `parseConfig`, `getParent`, `getParentBounds`, `lockOrientation`, `setParentSize`, `setGameSize`, `resize`, `setZoom`, `setMaxZoom`, `setSnap`, `refresh`, `updateOrientation`, `updateScale`, `getMaxZoom`, `updateCenter`, `updateBounds`, `transformX`, `transformY`, `startFullscreen`.
- `61309` @1075624: `AtlasXML`, `Canvas`, `Image`, `JSONArray`, `JSONHash`, `KTXParser`, `PVRParser`, `SpriteSheet`, `SpriteSheetFromAtlas`, `UnityYAML`.
- `15533` @1120746: unnamed local implementation.

## Texture

- `42099` @12563: `initialize`, `getTotalFrames`, `calculateDuration`, `addFrame`, `addFrameAt`, `checkFrame`, `getFirstTick`, `getFrameAt`, `getFrames`, `getNextTick`, `getFrameByProgress`, `nextFrame`, `handleYoyoFrame`, `getLastFrame`, `previousFrame`, `updateAndGetNextTick`, `removeFrame`, `removeFrameAt`, `repeatAnimation`, `toJSON`, `updateFrameSequence`, `pause`.
- `41138` @18051: `initialize`, `toJSON`, `destroy`.
- `15822` @84208: `GenerateTexture`, `Palettes`.
- `86741` @167347: unnamed local implementation.
- `37289` @176737: unnamed local implementation.
- `61683` @186568: `setCrop`, `resetCropObject`.
- `79812` @201209: `setCrop`, `setTexture`, `setFrame`, `resetCropObject`.
- `31401` @211865: `Alpha`, `AlphaSingle`, `BlendMode`, `ComputedSize`, `Crop`, `Depth`, `Flip`, `FX`, `GetBounds`, `Mask`, `Origin`, `PathFollower`, `Pipeline`, `PostPipeline`, `ScrollFactor`, `Size`, `Texture`, `TextureCrop`, `Tint`, `ToJSON`.
- `53208` @225905: unnamed local implementation.
- `42421` @226437: `initialize`, `addedToScene`, `removedFromScene`, `preUpdate`, `render`.
- `56480` @280948: `initialize`, `emit`, `isAlive`, `kill`, `setPosition`, `fire`, `update`, `computeVelocity`, `setSizeToFrame`, `getBounds`, `destroy`.
- `31600` @287183: `initialize`, `addedToScene`, `removedFromScene`, `setConfig`, `updateConfig`, `toJSON`, `resetCounters`, `startFollow`, `stopFollow`, `getFrame`, `setEmitterFrame`, `getAnim`, `setAnim`, `setRadial`, `addParticleBounds`, `setParticleSpeed`, `setParticleScale`, `setParticleGravity`, `setParticleAlpha`, `setParticleTint`, `setEmitterAngle`, `setParticleLifespan`.
- `48803` @429359: unnamed local implementation.
- `34684` @431320: unnamed local implementation.
- `85048` @433379: unnamed local implementation.
- `84409` @467433: unnamed local implementation.
- `76272` @547702: `initialize`, `addToCache`.
- `38734` @548714: `initialize`, `addToCache`.
- `74599` @549708: `initialize`, `addToCache`.
- `97025` @554454: `initialize`, `addToCache`.
- `14643` @565619: `initialize`, `onProcess`, `addToCache`.
- `19550` @567156: `onProcess`, `onProcessImage`, `loadImage`, `addToCache`.
- `59327` @569994: `initialize`, `onFileComplete`, `addToCache`.
- `67397` @575687: `initialize`, `onProcess`, `addToCache`.
- `25771` @583412: `initialize`, `addToCache`.
- `70554` @832737: `getTintFromFloats`, `getTintAppendFloatAlpha`, `getTintAppendFloatAlphaAndSwap`, `getFloatsFromUintRGB`, `checkShaderMax`, `parseFragmentShaderMaxTextures`, `setGlowQuality`.
- `8861` @910762: `initialize`, `setQualityLow`, `setQualityMedium`, `setQualityHigh`, `onDraw`.
- `63563` @913410: `initialize`, `onBoot`, `setTexture`, `onDraw`.
- `35407` @917973: unnamed local implementation.
- `78908` @918391: unnamed local implementation.
- `96293` @919186: unnamed local implementation.
- `36682` @920329: unnamed local implementation.
- `99155` @920613: unnamed local implementation.
- `24400` @921255: unnamed local implementation.
- `94328` @921955: unnamed local implementation.
- `41514` @923104: unnamed local implementation.
- `51078` @923776: unnamed local implementation.
- `90610` @924644: unnamed local implementation.
- `47838` @927414: unnamed local implementation.
- `98656` @927829: unnamed local implementation.
- `70463` @929718: unnamed local implementation.
- `50831` @931148: unnamed local implementation.
- `92595` @932144: unnamed local implementation.
- `72464` @933006: unnamed local implementation.
- `39249` @933816: unnamed local implementation.
- `2878` @934390: unnamed local implementation.
- `48247` @937479: unnamed local implementation.
- `39653` @939358: unnamed local implementation.
- `62143` @940008: unnamed local implementation.
- `98840` @941280: unnamed local implementation.
- `27681` @944027: unnamed local implementation.
- `45561` @944629: unnamed local implementation.
- `4327` @1047981: `initialize`, `setCutPosition`, `setCutSize`, `setSize`, `setTrim`, `setScale9`, `setCropUVs`, `updateCropUVs`, `setUVs`, `updateUVs`, `updateUVsInverted`, `clone`, `destroy`, `get`, `get`, `get`, `get`, `get`, `get`, `get`, `get`.
- `79237` @1052262: `initialize`, `add`, `remove`, `has`, `get`, `getTextureSourceIndex`, `getFramesFromTextureSource`, `getFrameBounds`, `getFrameNames`, `getSourceImage`, `getDataSourceImage`, `setDataSource`, `setFilter`, `destroy`.
- `44538` @1065360: unnamed local implementation.
- `63486` @1065394: unnamed local implementation.
- `86415` @1065518: unnamed local implementation.
- `30879` @1065555: unnamed local implementation.
- `27458` @1065731: unnamed local implementation.
- `89905` @1065973: unnamed local implementation.
- `78566` @1066829: unnamed local implementation.
- `39711` @1067766: unnamed local implementation.
- `75549` @1071902: unnamed local implementation.
- `47534` @1072641: unnamed local implementation.
- `16153` @1102518: unnamed local implementation.
- `33629` @1104420: `initialize`, `getTileProperties`, `getTileData`, `getTileCollisionGroup`, `containsTileIndex`, `getTileTextureCoordinates`, `setImage`, `setTileSize`, `setSpacing`, `updateTileData`.
- `8357` @1164022: unnamed local implementation.
- `86081` @1174933: `initialize`, `add`, `addFrame`, `getValue`, `hasTarget`, `updateTo`, `restart`, `nextState`, `onCompleteHandler`, `play`, `seek`, `initTweenData`, `reset`, `update`, `forward`, `rewind`, `dispatchEvent`, `destroy`.
- `42220` @1184885: `initialize`, `reset`, `update`, `dispatchEvent`, `destroy`.

## Tilemap

- `49477` @581673: `initialize`, `onProcess`, `addToCache`.
- `64589` @585978: `AnimationJSONFile`, `AsepriteFile`, `AtlasJSONFile`, `AtlasXMLFile`, `AudioFile`, `AudioSpriteFile`, `BinaryFile`, `BitmapFontFile`, `CompressedTextureFile`, `CSSFile`, `FontFile`, `GLSLFile`, `HTML5AudioFile`, `HTMLFile`, `HTMLTextureFile`, `ImageFile`, `JSONFile`, `MultiAtlasFile`, `MultiScriptFile`, `OBJFile`.
- `31989` @1077607: unnamed local implementation.
- `46029` @1096486: unnamed local implementation.
- `33528` @1107586: unnamed local implementation.
- `19545` @1109252: unnamed local implementation.
- `30003` @1109677: unnamed local implementation.
- `60540` @1111205: unnamed local implementation.
- `91141` @1112837: unnamed local implementation.
- `96523` @1113805: unnamed local implementation.
- `24152` @1114650: unnamed local implementation.
- `90454` @1114807: unnamed local implementation.
- `9474` @1115499: unnamed local implementation.
- `27229` @1115779: unnamed local implementation.
- `26303` @1119642: unnamed local implementation.
- `94178` @1120591: unnamed local implementation.
- `61325` @1124954: unnamed local implementation.
- `54503` @1125374: unnamed local implementation.
- `62501` @1130401: unnamed local implementation.
- `14977` @1130783: `initialize`.
- `46177` @1133493: unnamed local implementation.
- `12635` @1138100: unnamed local implementation.
- `22611` @1140269: unnamed local implementation.
- `28200` @1140948: unnamed local implementation.

## Sound

- `42363` @806599: unnamed local implementation.
- `87033` @968401: unnamed local implementation.
- `97482` @968829: `initialize`, `update`.
- `23717` @1005161: `SoundManagerCreator`, `Events`, `BaseSound`, `BaseSoundManager`, `WebAudioSound`, `WebAudioSoundManager`, `HTML5AudioSound`, `HTML5AudioSoundManager`, `NoAudioSound`, `NoAudioSoundManager`.

## Loader

- `41299` @531622: `initialize`, `setLink`, `resetXHR`, `load`, `onLoad`, `onBase64Load`, `onError`, `onProgress`, `onProcess`, `onProcessComplete`, `onProcessError`, `hasCacheConflict`, `addToCache`, `pendingDestroy`, `destroy`.
- `26430` @543716: `initialize`, `isReadyToProcess`, `addToMultiFile`, `onFileComplete`, `onFileFailed`, `pendingDestroy`, `destroy`.
- `23906` @546295: unnamed local implementation.
- `94486` @546742: unnamed local implementation.
- `85722` @553694: `initialize`, `onProcess`.
- `16024` @555540: `initialize`, `onProcess`.
- `87674` @560176: `initialize`, `onProcess`.
- `47931` @561308: `initialize`, `onProcess`, `addToCache`, `getShaderName`, `getShaderType`, `getShaderUniforms`, `extractBlock`.
- `88470` @564973: `initialize`, `onProcess`.
- `518` @569085: `initialize`, `onProcess`.
- `99297` @571779: `initialize`, `addToCache`.
- `58610` @573849: `initialize`, `onProcess`.
- `34328` @579499: `initialize`, `onProcess`.
- `57318` @585290: `initialize`, `onProcess`.
- `57777` @586739: unnamed local implementation.

## Tween

- `33951` @91469: `initialize`, `getBounds`, `getStartPoint`, `getResolution`, `getPoint`, `getPointAt`, `getTangent`, `getUtoTmapping`, `draw`, `toJSON`.
- `50994` @625352: `Between`, `BetweenPoints`, `BetweenPointsSquared`, `Chebyshev`, `Power`, `Snake`, `Squared`.
- `73162` @1019592: `initialize`, `add`, `addAt`, `getAt`, `getIndex`, `sort`, `getByName`, `getRandom`, `getFirst`, `getAll`, `count`, `swap`, `moveTo`, `moveAbove`, `moveBelow`, `remove`, `removeAt`, `removeBetween`, `removeAll`, `bringToTop`, `sendToBack`, `moveUp`.
- `88032` @1162068: unnamed local implementation.
- `26012` @1165784: unnamed local implementation.
- `30231` @1166499: `GetBoolean`, `GetEaseFunction`, `GetInterpolationFunction`, `GetNewValue`, `GetProps`, `GetTargets`, `GetValueOp`, `NumberTweenBuilder`, `StaggerBuilder`, `TweenBuilder`.
- `842` @1167051: `TWEEN_ACTIVE`, `TWEEN_COMPLETE`, `TWEEN_LOOP`, `TWEEN_PAUSE`, `TWEEN_RESUME`, `TWEEN_REPEAT`, `TWEEN_START`, `TWEEN_STOP`, `TWEEN_UPDATE`, `TWEEN_YOYO`.
- `43066` @1167291: unnamed local implementation.
- `95042` @1171024: `initialize`, `getTarget`, `setTargetValue`, `setCreatedState`, `setDelayState`, `setPendingRenderState`, `setPlayingForwardState`, `setPlayingBackwardState`, `setHoldState`, `setRepeatState`, `setCompleteState`, `isCreated`, `isDelayed`, `isPendingRender`, `isPlayingForward`, `isPlayingBackward`, `isHolding`, `isRepeating`, `isComplete`, `setStateFromEnd`, `setStateFromStart`, `reset`.
- `37105` @1196683: `Matrix`, `Add`, `AddAt`, `BringToTop`, `CountAllMatching`, `Each`, `EachInRange`, `FindClosestInSorted`, `Flatten`, `GetAll`, `GetFirst`, `GetRandom`, `MoveDown`, `MoveTo`, `MoveUp`, `MoveAbove`, `MoveBelow`, `NumberArray`, `NumberArrayStep`, `QuickSelect`.

## Particle

- `18404` @309156: `EmitterColorOp`, `EmitterOp`, `Events`, `GravityWell`, `Particle`, `ParticleBounds`, `ParticleEmitter`, `ParticleProcessor`, `Zones`.

## Plugin

- `89639` @494127: unnamed local implementation.
- `30472` @520761: `initialize`, `setEmitOnRepeat`, `onDown`, `onUp`, `reset`, `getDuration`, `destroy`.
- `64589` @585978: `AnimationJSONFile`, `AsepriteFile`, `AtlasJSONFile`, `AtlasXMLFile`, `AudioFile`, `AudioSpriteFile`, `BinaryFile`, `BitmapFontFile`, `CompressedTextureFile`, `CSSFile`, `FontFile`, `GLSLFile`, `HTML5AudioFile`, `HTMLFile`, `HTMLTextureFile`, `ImageFile`, `JSONFile`, `MultiAtlasFile`, `MultiScriptFile`, `OBJFile`.
- `73832` @779667: unnamed local implementation.
- `37277` @806941: unnamed local implementation.
- `18922` @812002: `BasePlugin`, `DefaultPlugins`, `PluginCache`, `PluginManager`, `ScenePlugin`.

## Scale

- `61619` @7824: unnamed local implementation.
- `94868` @7920: unnamed local implementation.
- `95532` @8057: unnamed local implementation.
- `2699` @8832: unnamed local implementation.
- `98739` @8968: unnamed local implementation.
- `98476` @9064: unnamed local implementation.
- `61061` @11479: `AlignTo`, `Angle`, `Call`, `GetFirst`, `GetLast`, `GridAlign`, `IncAlpha`, `IncX`, `IncXY`, `IncY`, `PlaceOnCircle`, `PlaceOnEllipse`, `PlaceOnLine`, `PlaceOnRectangle`, `PlaceOnTriangle`, `PlayAnimation`, `PropertyValueInc`, `PropertyValueSet`, `RandomCircle`, `RandomEllipse`.
- `89422` @113120: `initialize`, `set`, `reset`, `getData`, `brightness`, `saturate`, `desaturate`, `hue`, `grayscale`, `blackWhite`, `contrast`, `negative`, `desaturateLuminance`, `sepia`, `night`, `lsd`, `brown`, `vintagePinhole`, `kodachrome`, `technicolor`, `polaroid`, `shiftToBGR`.
- `12578` @145439: `initialize`, `get`, `set`, `get`, `set`, `get`, `set`.
- `25305` @150455: unnamed local implementation.
- `53048` @160885: unnamed local implementation.
- `2638` @166684: `initialize`, `setSize`, `setDisplayCallback`, `setScrollX`, `setScrollY`.
- `94215` @186166: `get`, `set`, `get`, `set`, `setSize`, `setDisplaySize`.
- `53774` @203038: unnamed local implementation.
- `16901` @203410: `get`, `set`, `get`, `set`, `get`, `set`, `get`, `set`, `get`, `set`, `setPosition`, `copyPosition`, `setRandomPosition`, `setRotation`, `setAngle`, `setScale`, `setX`, `setY`, `setZ`, `setW`, `getLocalTransformMatrix`, `getWorldTransformMatrix`.
- `61340` @206371: `initialize`, `get`, `set`, `get`, `set`, `get`, `set`, `get`, `set`, `get`, `set`, `get`, `set`, `get`, `set`, `get`, `set`, `get`, `get`, `get`, `get`, `loadIdentity`.
- `85592` @227269: unnamed local implementation.
- `39318` @435958: `initialize`, `setUVs`, `scrollUV`, `scaleUV`, `transformCoordinatesLocal`, `resize`, `update`, `load`.
- `93232` @458806: unnamed local implementation.
- `94434` @590531: `initialize`, `clone`, `set`, `copy`, `fromMat4`, `fromArray`, `identity`, `transpose`, `invert`, `adjoint`, `determinant`, `multiply`, `translate`, `rotate`, `scale`, `fromQuat`, `normalFromMat4`.
- `15746` @604757: `initialize`, `get`, `set`, `get`, `set`, `get`, `set`, `get`, `set`, `copy`, `set`, `add`, `subtract`, `scale`, `length`, `lengthSq`, `normalize`, `dot`, `lerp`, `rotationTo`, `setAxes`, `identity`.
- `26099` @612134: `initialize`, `clone`, `copy`, `setFromObject`, `set`, `setTo`, `setToPolar`, `equals`, `fuzzyEquals`, `angle`, `setAngle`, `add`, `subtract`, `multiply`, `scale`, `divide`, `negate`, `distance`, `distanceSq`, `length`, `setLength`, `lengthSq`.
- `25836` @614946: `initialize`, `up`, `min`, `max`, `clone`, `addVectors`, `subVectors`, `crossVectors`, `equals`, `copy`, `set`, `setFromMatrixPosition`, `setFromMatrixColumn`, `fromArray`, `add`, `addScalar`, `addScale`, `subtract`, `multiply`, `scale`, `divide`, `negate`.
- `61369` @619688: `initialize`, `clone`, `copy`, `equals`, `set`, `add`, `subtract`, `scale`, `length`, `lengthSq`, `normalize`, `dot`, `lerp`, `multiply`, `divide`, `distance`, `distanceSq`, `negate`, `transformMat4`, `transformQuat`, `reset`.
- `20926` @820208: unnamed local implementation.
- `89428` @912549: `initialize`, `onPreRender`, `onDraw`.
- `13560` @967192: unnamed local implementation.

## Text

- `19814` @82665: unnamed local implementation.
- `56836` @142132: unnamed local implementation.
- `87662` @165976: unnamed local implementation.
- `11164` @168737: unnamed local implementation.
- `57336` @177879: unnamed local implementation.
- `31401` @211865: `Alpha`, `AlphaSingle`, `BlendMode`, `ComputedSize`, `Crop`, `Depth`, `Flip`, `FX`, `GetBounds`, `Mask`, `Origin`, `PathFollower`, `Pipeline`, `PostPipeline`, `ScrollFactor`, `Size`, `Texture`, `TextureCrop`, `Tint`, `ToJSON`.
- `71259` @377185: unnamed local implementation.
- `78776` @580987: `initialize`, `onProcess`.
- `64589` @585978: `AnimationJSONFile`, `AsepriteFile`, `AtlasJSONFile`, `AtlasXMLFile`, `AudioFile`, `AudioSpriteFile`, `BinaryFile`, `BitmapFontFile`, `CompressedTextureFile`, `CSSFile`, `FontFile`, `GLSLFile`, `HTML5AudioFile`, `HTMLFile`, `HTMLTextureFile`, `ImageFile`, `JSONFile`, `MultiAtlasFile`, `MultiScriptFile`, `OBJFile`.
- `96602` @693099: unnamed local implementation.
- `79583` @1124387: unnamed local implementation.
- `52205` @1139682: unnamed local implementation.

## DOM

- `40987` @128248: `initialize`, `transparent`, `setTo`, `setGLTo`, `setFromRGB`, `setFromHSV`, `update`, `updateHSV`, `clone`, `gray`, `random`, `randomGray`, `saturate`, `desaturate`, `lighten`, `darken`, `brighten`, `get`, `get`, `get`, `get`, `set`.
- `3956` @135986: unnamed local implementation.
- `44777` @275342: `initialize`, `loadConfig`, `toJSON`, `onChange`, `getMethod`, `setMethods`, `has`, `hasBoth`, `hasEither`, `defaultEmit`, `defaultUpdate`, `proxyEmit`, `proxyUpdate`, `staticValueEmit`, `staticValueUpdate`, `randomStaticValueEmit`, `randomRangedValueEmit`, `randomRangedIntEmit`, `steppedEmit`, `easedValueEmit`, `easeValueUpdate`, `destroy`.
- `68875` @310663: `initialize`, `getPoint`.
- `21024` @310889: `DeathZone`, `EdgeZone`, `RandomZone`.
- `96503` @403696: `initialize`, `contains`, `getPoint`, `getPoints`, `getRandomPoint`, `setTo`, `setEmpty`, `setPosition`, `isEmpty`, `get`, `set`, `get`, `set`, `get`, `set`, `get`, `set`, `get`, `set`, `get`, `set`.
- `88911` @406735: unnamed local implementation.
- `8497` @408173: `initialize`, `contains`, `getPoint`, `getPoints`, `getRandomPoint`, `setTo`, `setEmpty`, `setPosition`, `setSize`, `isEmpty`, `getMinorRadius`, `getMajorRadius`, `get`, `set`, `get`, `set`, `get`, `set`, `get`, `set`.
- `49203` @410449: unnamed local implementation.
- `23031` @422680: `initialize`, `getPoint`, `getPoints`, `getRandomPoint`, `setTo`, `setFromObjects`, `getPointA`, `getPointB`, `get`, `set`, `get`, `set`, `get`, `set`, `get`, `set`.
- `2529` @425300: unnamed local implementation.
- `87841` @456559: `initialize`, `contains`, `getPoint`, `getPoints`, `getRandomPoint`, `setTo`, `setEmpty`, `setPosition`, `setSize`, `isEmpty`, `getLineA`, `getLineB`, `getLineC`, `getLineD`, `get`, `set`, `get`, `set`, `get`, `set`, `get`, `set`.
- `16483` @464612: `initialize`, `contains`, `getPoint`, `getPoints`, `getRandomPoint`, `setTo`, `getLineA`, `getLineB`, `getLineC`, `get`, `set`, `get`, `set`, `get`, `set`, `get`, `set`.
- `84435` @466540: unnamed local implementation.
- `17777` @1160509: unnamed local implementation.
- `88492` @1193207: unnamed local implementation.

## Math

- `22983` @5116: unnamed local implementation.
- `95253` @5334: unnamed local implementation.
- `41346` @5745: unnamed local implementation.
- `11575` @5968: unnamed local implementation.
- `91051` @7503: unnamed local implementation.
- `21837` @10461: unnamed local implementation.
- `21910` @10681: unnamed local implementation.
- `62054` @10902: unnamed local implementation.
- `73825` @88851: `initialize`, `getStartPoint`, `getResolution`, `getPoint`, `setXRadius`, `setYRadius`, `setWidth`, `setHeight`, `setStartAngle`, `setEndAngle`, `setClockwise`, `setRotation`, `get`, `set`, `get`, `set`, `get`, `set`, `get`, `set`, `get`, `set`.
- `42534` @93531: `initialize`, `addPoints`, `addPoint`, `getStartPoint`, `getResolution`, `getPoint`, `toJSON`.
- `7537` @133141: unnamed local implementation.
- `87837` @135084: unnamed local implementation.
- `57811` @140906: unnamed local implementation.
- `3217` @160416: unnamed local implementation.
- `6925` @163959: unnamed local implementation.
- `21859` @164756: unnamed local implementation.
- `16736` @199883: `get`, `set`, `get`, `set`, `setSizeToFrame`, `setSize`, `setDisplaySize`.
- `24502` @280050: `initialize`, `update`, `get`, `set`, `get`, `set`, `get`, `set`.
- `23629` @337648: `initialize`, `get`, `set`, `get`, `set`, `get`, `set`, `get`, `set`, `get`, `set`, `setRadius`, `setIterations`, `setStartAngle`, `setEndAngle`, `updateData`.
- `57847` @353924: `initialize`, `setLineWidth`, `setTo`.
- `48682` @359170: unnamed local implementation.
- `55911` @360722: `initialize`, `setPoints`, `setInnerRadius`, `setOuterRadius`, `get`, `set`, `get`, `set`, `get`, `set`, `updateData`.
- `79557` @367730: unnamed local implementation.
- `95166` @403608: unnamed local implementation.
- `71562` @404963: unnamed local implementation.
- `92110` @405033: unnamed local implementation.
- `28176` @406502: unnamed local implementation.
- `78874` @407191: unnamed local implementation.
- `92990` @407300: unnamed local implementation.
- `79522` @407456: unnamed local implementation.
- `24820` @410236: unnamed local implementation.
- `81491` @411132: unnamed local implementation.
- `63376` @411381: unnamed local implementation.
- `4042` @412242: unnamed local implementation.
- `71147` @414097: unnamed local implementation.
- `68389` @414586: unnamed local implementation.
- `16204` @416987: unnamed local implementation.
- `14199` @417359: unnamed local implementation.
- `91938` @419956: unnamed local implementation.
- `84993` @420037: unnamed local implementation.
- `34638` @421787: unnamed local implementation.
- `26408` @422313: unnamed local implementation.
- `98770` @422503: unnamed local implementation.
- `35001` @422572: unnamed local implementation.
- `64795` @423918: unnamed local implementation.
- `52616` @424045: unnamed local implementation.
- `87231` @424143: unnamed local implementation.
- `65822` @424403: unnamed local implementation.
- `69777` @424560: unnamed local implementation.
- `64400` @424859: unnamed local implementation.
- `62377` @425044: unnamed local implementation.
- `10809` @425231: unnamed local implementation.
- `83997` @425956: `initialize`, `getInCenter`, `contains`, `isCounterClockwise`, `load`, `transformCoordinatesLocal`, `updateBounds`, `isInView`, `scrollUV`, `scaleUV`, `setColor`, `update`, `translate`, `get`, `set`, `get`, `set`, `get`, `set`, `get`, `destroy`.
- `61485` @435235: unnamed local implementation.
- `92570` @435644: unnamed local implementation.
- `96550` @437573: unnamed local implementation.
- `73565` @437881: unnamed local implementation.
- `28793` @438325: unnamed local implementation.
- `94811` @440585: unnamed local implementation.
- `13829` @447106: unnamed local implementation.
- `98615` @450675: unnamed local implementation.
- `31688` @450764: unnamed local implementation.
- `80774` @452275: unnamed local implementation.
- `83859` @452366: unnamed local implementation.
- `19217` @452515: unnamed local implementation.
- `9477` @452911: unnamed local implementation.
- `53951` @454024: unnamed local implementation.
- `14649` @454274: unnamed local implementation.
- `33595` @454712: unnamed local implementation.
- `20074` @454946: unnamed local implementation.
- `92171` @455142: unnamed local implementation.
- `85133` @455637: unnamed local implementation.
- `26597` @455912: unnamed local implementation.
- `86470` @456064: unnamed local implementation.
- `36899` @458591: unnamed local implementation.
- `41658` @459631: unnamed local implementation.
- `39208` @459764: unnamed local implementation.
- `85614` @460941: unnamed local implementation.
- `39757` @463428: unnamed local implementation.
- `90260` @463954: unnamed local implementation.
- `99614` @464379: unnamed local implementation.
- `30976` @587191: unnamed local implementation.
- `26302` @587413: unnamed local implementation.
- `45319` @587541: unnamed local implementation.
- `61241` @587701: unnamed local implementation.
- `38857` @587766: `get`, `set`, `get`, `set`, `get`, `set`, `get`, `set`, `set`, `copy`, `setFromQuaternion`, `setFromRotationMatrix`.
- `99472` @589865: unnamed local implementation.
- `77623` @589938: unnamed local implementation.
- `86883` @604300: unnamed local implementation.
- `50040` @604369: unnamed local implementation.
- `37204` @604536: unnamed local implementation.
- `74362` @609918: unnamed local implementation.
- `60706` @610055: unnamed local implementation.
- `67421` @610241: unnamed local implementation.
- `36305` @610416: unnamed local implementation.
- `11520` @610549: unnamed local implementation.
- `1163` @610682: unnamed local implementation.
- `70336` @610812: unnamed local implementation.
- `2284` @611108: unnamed local implementation.
- `41013` @611187: unnamed local implementation.
- `16922` @611316: unnamed local implementation.
- `54261` @611612: unnamed local implementation.
- `44408` @611725: unnamed local implementation.
- `85955` @611899: unnamed local implementation.
- `60417` @622416: unnamed local implementation.
- `31040` @622565: unnamed local implementation.
- `55495` @622640: unnamed local implementation.
- `128` @622719: unnamed local implementation.
- `41273` @622796: unnamed local implementation.
- `1432` @622871: unnamed local implementation.
- `52285` @623073: unnamed local implementation.
- `12407` @623255: unnamed local implementation.
- `53993` @623339: unnamed local implementation.
- `90154` @623501: unnamed local implementation.
- `48736` @623580: unnamed local implementation.
- `61430` @623796: unnamed local implementation.
- `86554` @623915: unnamed local implementation.
- `36383` @624466: unnamed local implementation.
- `20339` @624713: unnamed local implementation.
- `52816` @624803: unnamed local implementation.
- `82340` @624980: unnamed local implementation.
- `14390` @625073: unnamed local implementation.
- `2243` @625191: unnamed local implementation.
- `91861` @627810: unnamed local implementation.
- `4177` @627878: unnamed local implementation.
- `57512` @627988: unnamed local implementation.
- `69965` @628391: unnamed local implementation.
- `50665` @628624: unnamed local implementation.
- `7744` @628929: unnamed local implementation.
- `24590` @629224: unnamed local implementation.
- `87844` @629299: unnamed local implementation.
- `89433` @629409: unnamed local implementation.
- `80461` @630675: unnamed local implementation.
- `34025` @630764: unnamed local implementation.
- `52768` @630856: unnamed local implementation.
- `75698` @631149: unnamed local implementation.
- `43855` @631236: unnamed local implementation.
- `25777` @631326: unnamed local implementation.
- `89318` @632753: unnamed local implementation.
- `77259` @632908: unnamed local implementation.
- ... 35 more matching modules indexed in `ASSET_INDEX.json`.
