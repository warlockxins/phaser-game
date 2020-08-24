// Copy of phaser-core.js
/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

require("phaser/src/polyfills");

var CONST = require("phaser/src/const");
var Extend = require("phaser/src/utils/object/Extend");

/**
 * @namespace Phaser
 */

/**
 * The root types namespace.
 *
 * @namespace Phaser.Types
 * @since 3.17.0
 */

var Phaser = {
    Animations: require("phaser/src/animations"),
    Cache: require("phaser/src/cache"),
    Cameras: { Scene2D: require("phaser/src/cameras/2d") },
    Core: require("phaser/src/core"),
    Class: require("phaser/src/utils/Class"),
    Data: require("phaser/src/data"),
    Display: { Masks: require("phaser/src/display/mask") },
    Events: require("phaser/src/events"),
    Game: require("phaser/src/core/Game"),
    GameObjects: {
        DisplayList: require("phaser/src/gameobjects/DisplayList"),
        GameObjectCreator: require("phaser/src/gameobjects/GameObjectCreator"),
        GameObjectFactory: require("phaser/src/gameobjects/GameObjectFactory"),
        UpdateList: require("phaser/src/gameobjects/UpdateList"),
        Components: require("phaser/src/gameobjects/components"),
        BuildGameObject: require("phaser/src/gameobjects/BuildGameObject"),
        BuildGameObjectAnimation: require("phaser/src/gameobjects/BuildGameObjectAnimation"),
        GameObject: require("phaser/src/gameobjects/GameObject"),
        Graphics: require("phaser/src/gameobjects/graphics/Graphics.js"),
        Image: require("phaser/src/gameobjects/image/Image"),
        Sprite: require("phaser/src/gameobjects/sprite/Sprite"),
        Text: require("phaser/src/gameobjects/text/static/Text"),
        Factories: {
            Graphics: require("phaser/src/gameobjects/graphics/GraphicsFactory"),
            Image: require("phaser/src/gameobjects/image/ImageFactory"),
            Sprite: require("phaser/src/gameobjects/sprite/SpriteFactory"),
            Text: require("phaser/src/gameobjects/text/static/TextFactory"),
        },
        Creators: {
            Graphics: require("phaser/src/gameobjects/graphics/GraphicsCreator"),
            Image: require("phaser/src/gameobjects/image/ImageCreator"),
            Sprite: require("phaser/src/gameobjects/sprite/SpriteCreator"),
            Text: require("phaser/src/gameobjects/text/static/TextCreator"),
        },
    },
    Input: require("phaser/src/input"),
    Loader: {
        FileTypes: {
            AnimationJSONFile: require("phaser/src/loader/filetypes/AnimationJSONFile"),
            AtlasJSONFile: require("phaser/src/loader/filetypes/AtlasJSONFile"),
            AudioFile: require("phaser/src/loader/filetypes/AudioFile"),
            AudioSpriteFile: require("phaser/src/loader/filetypes/AudioSpriteFile"),
            HTML5AudioFile: require("phaser/src/loader/filetypes/HTML5AudioFile"),
            ImageFile: require("phaser/src/loader/filetypes/ImageFile"),
            JSONFile: require("phaser/src/loader/filetypes/JSONFile"),
            MultiAtlasFile: require("phaser/src/loader/filetypes/MultiAtlasFile"),
            PluginFile: require("phaser/src/loader/filetypes/PluginFile"),
            ScriptFile: require("phaser/src/loader/filetypes/ScriptFile"),
            SpriteSheetFile: require("phaser/src/loader/filetypes/SpriteSheetFile"),
            TextFile: require("phaser/src/loader/filetypes/TextFile"),
            XMLFile: require("phaser/src/loader/filetypes/XMLFile"),
        },
        File: require("phaser/src/loader/File"),
        FileTypesManager: require("phaser/src/loader/FileTypesManager"),
        GetURL: require("phaser/src/loader/GetURL"),
        LoaderPlugin: require("phaser/src/loader/LoaderPlugin"),
        MergeXHRSettings: require("phaser/src/loader/MergeXHRSettings"),
        MultiFile: require("phaser/src/loader/MultiFile"),
        XHRLoader: require("phaser/src/loader/XHRLoader"),
        XHRSettings: require("phaser/src/loader/XHRSettings"),
    },
    Math: {
        Between: require("phaser/src/math/Between"),
        DegToRad: require("phaser/src/math/DegToRad"),
        FloatBetween: require("phaser/src/math/FloatBetween"),
        RadToDeg: require("phaser/src/math/RadToDeg"),
        Vector2: require("phaser/src/math/Vector2"),
    },
    Plugins: require("phaser/src/plugins"),
    Renderer: require("phaser/src/renderer"),
    Scale: require("phaser/src/scale"),
    Scene: require("phaser/src/scene/Scene"),
    Scenes: require("phaser/src/scene"),
    Structs: require("phaser/src/structs"),
    Textures: require("phaser/src/textures"),
    Time: require("phaser/src/time"),
    Tweens: require("phaser/src/tweens"),
};

//   Merge in the consts

Phaser = Extend(false, Phaser, CONST);

//  Export it

// if (typeof FEATURE_SOUND)
// {
//     Phaser.Sound = require('phaser/src/sound');
// }

module.exports = Phaser;

global.Phaser = Phaser;

/*
 * "Documentation is like pizza: when it is good, it is very, very good;
 * and when it is bad, it is better than nothing."
 *  -- Dick Brandon
 */
